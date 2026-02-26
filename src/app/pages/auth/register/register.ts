import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageService } from 'primeng/api';

function adultValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return { adult: true };

  const birth = new Date(value);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  return age >= 18 ? null : { adult: true };
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  if (!pass || !confirm) return null;
  return pass === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    DatePickerModule,
    KeyFilterModule
  ],
  providers: [MessageService],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  loading = false;

  form!: FormGroup; // 👈 se inicializa en el constructor

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        address: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
        birthDate: [null, [adultValidator]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern(/^(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{10,}$/)
          ]
        ],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [passwordMatchValidator] }
    );
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Revisa los campos marcados.'
      });
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Registro OK',
        detail: 'Datos validados correctamente.'
      });

      this.router.navigate(['/login']);
    }, 700);
  }
}