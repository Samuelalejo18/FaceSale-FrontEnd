import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  if (!authService.loggedIn()) {
    router.navigate(['/login']);

    Swal.fire({
      icon: 'error',
      title: 'No puedes acceder. Debes estar autenticado. ',
      text: "Inicia sesión. ",
      confirmButtonText: 'OK',
      width: 500,

    });
    return false;
  }
  return true;
};
