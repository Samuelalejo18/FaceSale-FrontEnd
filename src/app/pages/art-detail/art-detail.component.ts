import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArtService } from '../../services/art.service';
import { get } from 'jquery';
import { AuctionService } from '../../services/auction.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-art-detail',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './art-detail.component.html',
  styleUrl: './art-detail.component.css',
})
export class ArtDetailComponent implements OnInit {
  artwork: {
    title: string;
    category: string;
    artist: string;
    yearCreated: number | null;
    description: string;
    technique: string;
    dimensions: {
      height_cm: number | null;
      width_cm: number | null;
      depth_cm: number;
    };
    images: { image: { data: { data: number[] }; contentType: string } }[];
    startingPrice: number | null;
    status: string;
    imageSrc?: string;
  } = {
    title: '',
    category: '',
    artist: '',
    yearCreated: null,
    description: '',
    technique: '',
    dimensions: {
      height_cm: null,
      width_cm: null,
      depth_cm: 0,
    },
    images: [],
    startingPrice: null,
    status: '',
    // timestamps se agregan automáticamente por mongoose
  };

  participants: any = [];

  auction = {
    _id: '',
    artworkId: null,
    status: '', // Valor por defecto
    startDate: null,
    endDate: null,
    participants: [],
    winner: null,
  };
  intervalId: any;
  applyFilter() {}
  searchTerm: string = '';

  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private artService: ArtService,
    private auctionService: AuctionService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log('ID:', this.id);
    this.getArtById(this.id);
    this.getAuctionByIdArt(this.id);
    this.intervalId = setInterval(() => {
      // Esto forzará Angular a recalcular la vista
    }, 60000); // cada 60 segundos
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getArtById(id: string) {
    this.artService.getArtById(id).subscribe({
      next: (response) => {
        this.artwork = response;

        const bufferData = this.artwork.images?.[0]?.image?.data?.data;
        if (bufferData) {
          const base64 = this.bufferToBase64(bufferData);
          this.artwork.imageSrc = `data:${this.artwork.images[0].image.contentType};base64,${base64}`;
        } else {
          this.artwork.imageSrc = 'assets/placeholder.jpg';
        }
      },
      error: (err) => {
        console.error('Error fetching art details:', err);
      },
    });
  }

  /**
   * Convierte un array de bytes a Base64.
   */
  bufferToBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    if (typeof btoa === 'function') {
      return btoa(binary);
    }

    return Buffer.from(binary, 'binary').toString('base64');
  }

  getAuctionByIdArt(id: string) {
    this.auctionService.getAuctionByIdArt(id).subscribe({
      next: (response) => {
        this.auction = response;
        console.log('Auction:', this.auction);
      },
      error: (err) => {
        console.error('Error fetching auction details:', err);
      },
    });
  }

  getAuctionDuration(): string {
    if (!this.auction.endDate) return '';

    const now = new Date();
    const endDate = new Date(this.auction.endDate);

    if (now >= endDate) {
      this.auctionService.updateAuctionFinalize(this.auction._id).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Subasta finalizada! ',
            text: response.message,

            confirmButtonText: 'OK',
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: 'Subasta finalizad! ',
            text: err.error.message,

            confirmButtonText: 'OK',
          });
        },
      });
      //this.auction.status = 'finalizada'; // Opcional: actualizar estado
      return 'Subasta finalizada';
    }

    // Calcula la diferencia de tiempo en milisegundos entre la fecha de cierre y la fecha actual
    let diff = endDate.getTime() - now.getTime();

    // Define cuántos milisegundos hay en un minuto, una hora, un día y un mes (mes aproximado de 30 días)
    const msInMinute = 60 * 1000;
    const msInHour = 60 * msInMinute;
    const msInDay = 24 * msInHour;
    const msInMonth = 30 * msInDay; // Aproximación: 30 días por mes

    // Calcula la cantidad de meses completos en la diferencia
    const months = Math.floor(diff / msInMonth);
    diff -= months * msInMonth; // Resta los milisegundos correspondientes a los meses

    // Calcula la cantidad de días completos en el tiempo restante
    const days = Math.floor(diff / msInDay);
    diff -= days * msInDay; // Resta los milisegundos correspondientes a los días

    // Calcula la cantidad de horas completas en el tiempo restante
    const hours = Math.floor(diff / msInHour);
    diff -= hours * msInHour; // Resta los milisegundos correspondientes a las horas

    // Calcula la cantidad de minutos completos en el tiempo restante
    const minutes = Math.floor(diff / msInMinute);

    // Construye el string final con los valores encontrados (solo si son mayores a 0)
    let result = '';
    if (months > 0) result += `${months} mes${months > 1 ? 'es' : ''} |`;
    if (days > 0) result += `${days} día${days > 1 ? 's' : ''} |`;
    if (hours > 0) result += `${hours} hora${hours > 1 ? 's' : ''} |`;
    if (minutes > 0) result += `${minutes} minuto${minutes > 1 ? 's' : ''}|`;

    return result.trim();
  }

  toBid(id: string, data: { userId: string; bidAmount: number }) {
    this.auctionService.updateAuctionBid(id, data).subscribe({
      next: (response) => {
        this.auction = response;
        console.log('Auction:', this.auction);
      },
      error: (err) => {
        console.error('Error fetching auction details:', err);
      },
    });
  }
}
