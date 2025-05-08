import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  user = {
    name: "",
    lastName: "",
    userName: "",
    identityDocument: 0,
    age: 0,
    email: "",
    password: "",
    numberPhone: 0,
    country: "",
    city: "",
    address: "",
  }

  constructor(private authService: AuthService) {

  }

  signUp() {



    this.authService.registerUser(this.user).subscribe({
      next: (response) => {

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Bienvenido al sistema.'
        });
      },
      error: (err) => {
        //  el backend responde:
        // { errors?: string[], message?: string }
        const apiErr = err.error || {};
        const validationErrors: string[] = apiErr.errors || [];
        const authMessage: string = apiErr.message || '';

        // arma un bloque HTML
        let html = '';
        if (authMessage) {
          html += `<p>${authMessage}</p>`;
        }
        if (validationErrors.length) {
          html += `<ul style="text-align: left;  margin: 0 auto; display: inline-block;">` +
            validationErrors.map(msg => `<li>${msg}</li>`).join('') +
            `</ul>`;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al Registrarse',
          // si usas `html`, SweetAlert no mostrará `text`
          html,
          confirmButtonText: 'OK',
          width: 500,

        });
      }
    });



  }
}