import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-form-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.css',
})
export class FormRegisterComponent {
  user = {
    name: '',
    lastName: '',
    userName: '',
    identityDocument: 0,
    age: 0,
    email: '',
    password: '',
    numberPhone: 0,
    country: '',
    city: '',
    address: '',
  };
  usuarioRegistrado: boolean = true;
  @Output() notificarUser = new EventEmitter<{
    name: string;
    lastName: string;
    userName: string;
    identityDocument: number;
    age: number;
    email: string;
    password: string;
    numberPhone: number;
    country: string;
    city: string;
    address: string;
    usuarioRegistrado: boolean;
  }>();
  constructor(private authService: AuthService, private router: Router) {}

  signUp() {
    this.authService.registerCredentialsUser(this.user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Credenciales correctas',
          text: response.message,
        });
        this.notificarUser.emit({
          name: this.user.name,
          lastName: this.user.lastName,
          userName: this.user.userName,
          identityDocument: this.user.identityDocument,
          age: this.user.age,
          email: this.user.email,
          password: this.user.password,
          numberPhone: this.user.numberPhone,
          country: this.user.country,
          city: this.user.city,
          address: this.user.address,
          usuarioRegistrado: this.usuarioRegistrado,
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
          title: 'Error al registrar los datos del usuario',
          // si usas `html`, SweetAlert no mostrará `text`
          html,
          confirmButtonText: 'OK',
          width: 400,
        });
      },
    });
  }
}
