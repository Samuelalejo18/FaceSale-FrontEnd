import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  autenticado: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.autenticado = this.authService.loggedIn().valueOf();
  }
}
