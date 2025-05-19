import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pago',
  imports: [FormsModule, CommonModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class PagoComponent {
  numeroTarjeta: string = '';
  nombreTarjeta: string = '';
  mesExpiracion: string = '';
  yearExpiracion: string = '';
  ccv: string = '';
  logoMarca: string = '';
  mostrarFormulario: boolean = false;
  mostrarTarjeta: boolean = false;

  meses = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  years = Array.from({ length: 9 }, (_, i) =>
    (new Date().getFullYear() + i).toString()
  );

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    console.log('Formulario:', this.mostrarFormulario);
  }

  toggleTarjeta() {
    this.mostrarTarjeta = !this.mostrarTarjeta;
  }

  mostrarFrente() {
    this.mostrarTarjeta = false;
  }

  mostrarTrasera() {
    this.mostrarTarjeta = true;
  }

  actualizarNumeroTarjeta() {
    this.numeroTarjeta = this.numeroTarjeta
      .replace(/\s/g, '')
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();

    this.mostrarFrente();

    if (this.numeroTarjeta.startsWith('4')) {
      this.logoMarca = '../../../assets/img/pago/logos/visa.png';
    } else if (this.numeroTarjeta.startsWith('5')) {
      this.logoMarca = '../../../assets/img/pago/logos/mastercard.png';
    } else {
      this.logoMarca = '';
    }
  }

  actualizarNombreTarjeta() {
    this.nombreTarjeta = this.nombreTarjeta.replace(/[0-9]/g, '');
    this.mostrarFrente();
  }

  actualizarCCV() {
    this.ccv = this.ccv.replace(/\D/g, '');
  }
}
