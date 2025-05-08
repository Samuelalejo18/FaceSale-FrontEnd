import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    email: "",
    password: ""
  }


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  signIn() {





    this.authService.loginUser(this.user).subscribe({
      next: (response) => {



        Swal.fire({
          icon: 'success',
          title: '¡Login exitoso!',
          text: 'Bienvenido al sistema.'
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
          html += `<ul style="text-align: left;  margin: 0 auto; display: inline-block;">` +
            validationErrors.map(msg => `<li>${msg}</li>`).join('') +
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
      }
    });



  }
}