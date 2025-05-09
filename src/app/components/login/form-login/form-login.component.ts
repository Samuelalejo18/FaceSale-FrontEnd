import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-form-login',
  imports: [ FormsModule, RouterModule],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.css',
})
export class FormLoginComponent {
  user = {
    email: '',
    password: '',
  };
  @Output() notificarUser = new EventEmitter<{
    email: string;
    password: string;
  }>();

  constructor(private authService: AuthService) {}

  enviarUsuario() {}

  signInCredentials() {
    this.authService.loginUserCredentials(this.user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Credenciales correctas',
          text: response.message,
        });
        this.notificarUser.emit({
          email: this.user.email,
          password: this.user.password,
        });
      },
      error: (err) => {
        // el backend responde:
        // { errors?: string[] de los errores de zod, message?: string errores de registro y autenticacion de la bd }
        const apiErr = err.error || {};
        const validationErrors: string[] = apiErr.errors || [];
        const authMessage: string = apiErr.message || '';

        // arma un bloque HTML
        let html = '';
        if (authMessage) {
          html += `<p>${authMessage}</p>`;
        }
        if (validationErrors.length) {
          html +=
            `<ul style="text-align: left;  margin: 0 auto; display: inline-block;">` +
            validationErrors.map((msg) => `<li>${msg}</li>`).join('') +
            `</ul>`;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          // si usas `html`, SweetAlert no mostrará `text`
          html,
          confirmButtonText: 'OK',
          width: 400,
        });
      },
    });
  }
}
