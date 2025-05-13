import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { trigger, style, transition, animate } from '@angular/animations';
import { FormFacialComponent } from '../../components/form-facial/form-facial.component';
import { FormRegisterComponent } from '../../components/form-register/form-register.component';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    FormRegisterComponent,
    RouterModule,
    FormFacialComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('400ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class RegisterComponent {
  usuarioRecibido: boolean = false;
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

  constructor(private authService: AuthService, private router: Router) {}

  recibirUsuario(user: {
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
  }) {
    this.user = user;
    this.usuarioRecibido = user.usuarioRegistrado; // ya está validado si llegó aquí
    console.log('Usuario recibido:', this.user);
  }

  signUp() {
    this.authService.registerUser(this.user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: '¿Deseas Iniciar Sesión?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Sí',
          denyButtonText: `No`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          } else if (result.isDenied) {
            Swal.fire('Ok, puedes seguir registrando usuarios.', '', 'info');
          }
        });
        /*
                Swal.fire({
                  icon: 'success',
                  title: '¡Registro exitoso!',
                  text: 'Bienvenido al sistema.'
                });
          */
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
          html +=
            `<ul style="text-align: left;  margin: 0 auto; display: inline-block;">` +
            validationErrors.map((msg) => `<li>${msg}</li>`).join('') +
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
      },
    });
  }
}
