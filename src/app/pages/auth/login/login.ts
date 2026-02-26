import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.msg.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Completa email y contraseña.'
      });
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    this.loading = true;

    const ok = this.auth.login(email, password);

    this.loading = false;

    if (!ok) {
      this.msg.add({
        severity: 'error',
        summary: 'Acceso denegado',
        detail: 'Credenciales incorrectas.'
      });
      return;
    }

    this.msg.add({
      severity: 'success',
      summary: 'Bien',
      detail: 'Inicio de sesión correcto.'
    });

    this.router.navigateByUrl('/');
  }
}