import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/User';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-actualizar-perfil',
  imports: [HeaderComponent, FormsModule, RouterModule],
  templateUrl: './actualizar-perfil.component.html',
  styleUrl: './actualizar-perfil.component.css',
})
export class ActualizarPerfilComponent implements OnInit {
  user: IUser | null = null;
  updateUser = {
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
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.profile();
  }

  profile() {
    this.authService.verifyToken().subscribe({
      next: (response) => {
        this.user = response;
        console.log('Usuario autenticado:', this.user);
      },
      error: (err) => {
        console.error('Error al verificar el token', err);
      },
    });
  }

  updateProfile() {
    if (this.user) {
      this.userService.updateUser(this.user.id, this.updateUser).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: response.message,
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
            title: 'Error al  actualizar el perfil',
            // si usas `html`, SweetAlert no mostrará `text`
            html,
            confirmButtonText: 'OK',
            width: 400,
          });
        },
      });
    }
  }
}
