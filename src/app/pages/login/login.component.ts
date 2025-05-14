import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { trigger, style, transition, animate } from '@angular/animations';
import { FormFacialComponent } from '../../components/form-facial/form-facial.component';
import { FormLoginComponent } from '../../components/form-login/form-login.component';

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

  user: {
    faceDescriptor: Float32Array | null;
    email: string;
    password: string;
  } = {
    faceDescriptor: null,
    email: '',
    password: '',
  };

  descriptorFacial: Float32Array | null = null;
  faceImageBase64: string = '';
  descriptorFacialRecibido: boolean = false;

  recibirUsuario({
    email,
    password,
    usuarioAutenticado,
    faceDescriptor,
  }: {
    email: string;
    password: string;
    usuarioAutenticado: boolean;
    faceDescriptor: Float32Array | null;
  }) {
    this.user.email = email;
    this.user.password = password;
    this.usuarioRecibido = usuarioAutenticado;
    this.user.faceDescriptor = faceDescriptor;
  }

  constructor(private authService: AuthService, private router: Router) {}

  recibirDescriptor(data: {
    descriptorFace: Float32Array | null;
    faceImageBase64: string;
  }) {
    this.descriptorFacial = data.descriptorFace;
    this.faceImageBase64 = data.faceImageBase64;

    if (this.descriptorFacial !== null && this.faceImageBase64 !== '') {
      this.descriptorFacialRecibido = true;
      // ¡Importante! copiar al objeto user:
      this.user.faceDescriptor = this.descriptorFacial;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  signIn() {
    if (!this.descriptorFacialRecibido || !this.user.faceDescriptor) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta reconocimiento facial',
        text: 'Realiza el escaneo facial antes de iniciar sesión.',
      });
      return;
    }
    let descriptorArray: number[] = [];
    if (this.user.faceDescriptor) {
      descriptorArray = Array.from(this.user.faceDescriptor);
    }
    const payload = {
      email: this.user.email,
      password: this.user.password,
      // convierte Float32Array → array de números
      descriptorFacial: descriptorArray,
    };

    this.authService.loginUser(payload).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Login exitoso! ',
          text: 'Bienvenido al sistema ' + response.userName,

          confirmButtonText: 'OK',
        });
        //direccionar al componente protejido
        this.router.navigate(['/private']);
      },
      error: (err) => {
        // el backend responde:
        // { errors?: string[] de los errores de zod, message?: string errores de registro y autenticacion de la bd }
        const apiErr = err.error || {};
        const authMessage: string = apiErr.message || '';

        // arma un bloque HTML
        let html = '';
        if (authMessage) {
          html += `<p>${authMessage}</p>`;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          // si usas `html`, SweetAlert no mostrará `text`
          html,
          confirmButtonText: 'OK',
          width: 400,
        });
        setTimeout(() => {
          location.reload(); // Recarga la página
        }, 4000); // Espera 2 segundos antes de recargar
      },
    });
  }
}
