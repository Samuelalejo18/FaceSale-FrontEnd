import { Component, OnInit } from '@angular/core';
import { ArtService } from '../../services/art.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css'],
})
export class EcommerceComponent implements OnInit {
  listArt: any[] = []; // datos originales
  filteredList: any[] = []; // datos tras búsqueda / filtros

  // 1) Modelo de búsqueda
  searchTerm: string = '';
  categoriesList = ['Arte 1', 'Arte 2', 'Arte 3', 'Arte 4'];

  // 2) Ejemplo de filtros (añade los que necesites)
  filters: {
    onlyGold: boolean;
    onlyGold2: boolean;
    categories: string[];
  } = {
    onlyGold: false, // ejemplo: startingPrice >= 1000
    onlyGold2: false,
    categories: [],
  };

  showFilters = false; // controla si se ve el panel de filtros

  constructor(private artService: ArtService) {}

  ngOnInit(): void {
    this.artService.getAllArtData().subscribe((data) => {
      this.listArt = data.map((item: any) => {
        const bufferData = item.images?.[0]?.image?.data?.data;
        if (bufferData) {
          const base64 = this.bufferToBase64(bufferData);
          item.imageSrc = `data:${item.images[0].image.contentType};base64,${base64}`;
        } else {
          item.imageSrc = 'assets/placeholder.jpg';
        }
        return item;
      });
      // al cargar, inicializar también la lista filtrada
      this.applyFilters();
    });
  }

  bufferToBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  trackById(index: number, item: any): string {
    return item._id;
  }

  toggleFilterPanel() {
    this.showFilters = !this.showFilters;
  }

  // 3) Método que aplica búsqueda + filtros
  applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredList = this.listArt.filter((item) => {
      // a) búsqueda por título o artista
      const matchesSearch =
        item.title.toLowerCase().includes(term) ||
        item.artist.toLowerCase().includes(term);
      if (!matchesSearch) return false;

      // b) filtro onlyGold
      if (this.filters.onlyGold && item.startingPrice < 2000) {
        return false;
      }

      // b) filtro onlyGold2
      if (this.filters.onlyGold2 && item.startingPrice < 20000) {
        return false;
      }

      // c) filtro por categoría
      if (
        this.filters.categories.length > 0 &&
        !this.filters.categories.includes(item.category)
      ) {
        return false;
      }

      // añadir aquí más condiciones según tus filtros...

      return true;
    });
  }
}
