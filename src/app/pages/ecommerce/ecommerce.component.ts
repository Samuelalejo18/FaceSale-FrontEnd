import { Component, OnInit } from '@angular/core';
import { ArtService } from '../../services/art.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';

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
  //Filtrar por título
  searchTerm: string = '';

  //filtrar por artista
  searchArtistTerm: string = '';
  //Filtrar por categoría
  categories: string[] = [
    'Pintura',
    'Escultura',
    'Fotografía',
    'Dibujo',
    'Grabado',
    'Arte digital',
    'Instalación',
    'Performance',
    'Arte textil',
    'Arte sonoro',
    'Arte conceptual',
  ];

  selectedCategories: string[] = [];

  // —— NUEVO filtro por precio ——
  minPrice: number = 0;
  maxPrice: number = 0;

  //Por estado
  estados: string[] = ['pending', 'in_auction', 'sold'];

  estadoSeleccionado: string[] = [];
  constructor(private artService: ArtService) {}

  ngOnInit(): void {
    this.getArts();
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
    this.applyFilter();
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
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredList = this.listArt.filter((item) =>
      item.title.toLowerCase().includes(term)
    );
  }

  searchArtist() {
    const term = this.searchArtistTerm.trim().toLowerCase();

    this.filteredList = this.listArt.filter((item) =>
      item.artist.toLowerCase().includes(term)
    );
  }

  onCategoryChange(cat: string, checked: boolean): void {
    if (checked) {
      this.selectedCategories.push(cat);
    } else {
      this.selectedCategories = this.estadoSeleccionado.filter(
        (c) => c !== cat
      );
    }
    this.applyFilter();
  }


   onStateChange(cat: string, checked: boolean): void {
    if (checked) {
      this.estadoSeleccionado.push(cat);
    } else {
      this.estadoSeleccionado = this.selectedCategories.filter(
        (c) => c !== cat
      );
    }
    this.applyFilter();
  }

  applyFilter() {
    if (this.searchTerm) {
      this.searchTitle();
    } else {
      this.filteredList = this.listArt;
    }

    if (this.searchArtistTerm) {
      this.searchArtist();
    } else {
      this.filteredList = this.listArt;
    }

    if (this.selectedCategories.length > 0) {
      this.filteredList = this.filteredList.filter((item) =>
        this.selectedCategories.includes(item.category)
      );
    } else {
      this.filteredList = this.listArt;
    }





    if (this.minPrice || this.maxPrice) {
      this.filteredList = this.filteredList.filter((item) => {
        const price = item.startingPrice ?? 0; // Asegúrate de que el campo exista
        const priceMatch = price >= this.minPrice && price <= this.maxPrice;
        return priceMatch;
      });
    }
  }
}
