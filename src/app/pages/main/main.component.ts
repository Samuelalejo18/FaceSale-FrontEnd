import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  menuAbierto = false;

  alternarMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
