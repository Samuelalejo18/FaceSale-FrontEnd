import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormLoginComponent } from './form-login/form-login.component';
import { FormFacialComponent } from '../form-facial/form-facial.component';
import {
  trigger,

  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-login',

  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FormFacialComponent,
    FormLoginComponent,
  ],
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
export class LoginComponent implements OnInit, OnDestroy {
  usuarioRecibido: boolean = false;

  user = {
    email: '',
    password: '',
  };

  recibirUsuario({ email, password }: { email: string; password: string }) {
    console.log('Usuario recibido:', email, password);
    this.user.email = email;
    this.user.password = password;
    if (this.user.email != '' && this.user.password != '') {
      this.usuarioRecibido = true;
    } else {
      this.usuarioRecibido = false;
    }
  }

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {}

  signIn() {
    this.authService.loginUser(this.user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Login exitoso!',
          text: 'Bienvenido al sistema.',
        });
        //direccionar al componente protejido
        this.router.navigate(['/private']);
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
