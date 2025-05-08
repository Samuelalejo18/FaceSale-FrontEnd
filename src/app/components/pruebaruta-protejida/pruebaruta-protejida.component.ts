import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pruebaruta-protejida',
  imports: [],
  templateUrl: './pruebaruta-protejida.component.html',
  styleUrl: './pruebaruta-protejida.component.css'
})
export class PruebarutaProtejidaComponent {

  constructor(private authService: AuthService,
    private router: Router

  ) {

  }
  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        // 1) Borra la cookie local
        Cookies.remove('token', { path: '/' });

        // 2) Muestra la alerta con el mensaje del servidor
        Swal.fire({
          icon: 'success',
          title: response.message,
          confirmButtonText: 'OK'
        }).then(() => {
          // 3) Redirige al login
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cerrar sesión',
          text: err?.error?.message || 'Inténtalo de nuevo más tarde',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}