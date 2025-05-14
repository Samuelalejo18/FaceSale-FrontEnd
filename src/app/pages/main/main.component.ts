import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-main',
  imports: [RouterModule, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  menuAbierto = false;

  alternarMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
