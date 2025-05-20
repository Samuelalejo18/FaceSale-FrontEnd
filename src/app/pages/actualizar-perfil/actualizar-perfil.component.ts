import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/User';

@Component({
  selector: 'app-actualizar-perfil',
  imports: [HeaderComponent],
  templateUrl: './actualizar-perfil.component.html',
  styleUrl: './actualizar-perfil.component.css',
})
export class ActualizarPerfilComponent implements OnInit {
  user: IUser | null = null;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.profile();
  }

  profile() {
    this.authService.verifyToken().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (err) => {
        console.error('Error al verificar el token', err);
      },
    });
  }
}
