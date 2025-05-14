import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { trigger, style, transition, animate } from '@angular/animations';
import { FormFacialComponent } from '../../components/form-facial/form-facial.component';
import { FormRegisterComponent } from '../../components/form-register/form-register.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    FormRegisterComponent,
    RouterModule,
    FormFacialComponent,
    CommonModule,
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

  descriptorFacial: Float32Array | null = null;
  faceImageBase64: string = '';
  descriptorFacialRecibido: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  recibirDescriptor(data: {
    descriptorFace: Float32Array | null;
    faceImageBase64: string;
  }) {
    this.descriptorFacial = data.descriptorFace;
    this.faceImageBase64 = data.faceImageBase64;
    if (this.descriptorFacial !== null && this.faceImageBase64 !== '') {
      console.log( typeof this.descriptorFacial);
      console.log('Imagen en base64:', this.faceImageBase64);
      this.descriptorFacialRecibido = true;
    }
  }

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

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  signUp() {
    if (this.descriptorFacialRecibido && this.usuarioRecibido) {
      // 1) Crea el FormData
      const form = new FormData();
      form.append('name', this.user.name);
      form.append('lastName', this.user.lastName);
      form.append('userName', this.user.userName);
      form.append('identityDocument', this.user.identityDocument.toString());
      form.append('age', this.user.age.toString());
      form.append('email', this.user.email);
      form.append('password', this.user.password);
      form.append('numberPhone', this.user.numberPhone.toString());
      form.append('country', this.user.country);
      form.append('city', this.user.city);
      form.append('address', this.user.address);

      // 2) Descriptor facial como JSON string
      form.append(
        'faceDescriptor',
        JSON.stringify(Array.from(this.descriptorFacial!))
      );

      // 3) Imagen como Blob, con la misma clave que espera multer
      form.append(
        'faceImage',
        this.dataURLtoBlob(this.faceImageBase64),
        'selfie.png'
      );
      this.authService.registerUser(form).subscribe({
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
               this.router.navigate(['/register']);
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
}
