import { Component, OnInit } from '@angular/core';
import { ArtService } from '../../services/art.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { get } from 'jquery';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, NgxPaginationModule],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css'],
})
export class EcommerceComponent implements OnInit {
  listArt: any[] = []; // datos originales

  filteredList: any[] = []; // datos tras búsqueda / filtros
  currentPage = 1;

  searchTerm: string = '';
  constructor(private artService: ArtService) {}

  ngOnInit(): void {
    this.getArts();
    this.searchTitle();
  }

  getArts(): void {
    this.artService.getAllArtData().subscribe((data) => {
      this.listArt = data.map((item: any) => {
        const bufferData = item.images?.[0]?.image?.data?.data;
        if (bufferData) {
          // convertimos el array de bytes a Base64
          const base64 = this.bufferToBase64(bufferData);
          item.imageSrc = `data:${item.images[0].image.contentType};base64,${base64}`;
        } else {
          item.imageSrc = 'assets/placeholder.jpg';
        }
        return item;
      });
    });
  }

  /**
   * Convierte un array de bytes (number[]) a string Base64.
   * Usa btoa() en navegador y Buffer en entornos sin window.
   */
  bufferToBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // En navegador: btoa está disponible globalmente
    if (typeof btoa === 'function') {
      return btoa(binary);
    }

    // En Node/Vite/SSR: usar Buffer
    return Buffer.from(binary, 'binary').toString('base64');
  }

  trackById(index: number, item: any): string {
    return item._id;
  }

  searchTitle() {
    if (this.searchTerm) {
      const term = this.searchTerm.trim().toLowerCase();

      this.filteredList = this.listArt.filter((item) =>
        item.title.toLowerCase().includes(term)
      );
    } else {
      this.filteredList = this.listArt;
    }
  }
}
