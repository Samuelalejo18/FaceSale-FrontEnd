import { Component, OnInit } from '@angular/core';
import { ArtService } from '../../services/art.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, NgxPaginationModule],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css'],
})
export class EcommerceComponent implements OnInit {
  listArt: any[] = [];
  filteredList: any[] = [];
  currentPage = 1;
  searchTerm: string = '';
  searchArtistTerm: string = '';
  
  // Cache para imágenes procesadas
  private imageCache = new Map<string, string>();
  
  categories: string[] = [
    'Pintura', 'Escultura', 'Fotografía', 'Dibujo', 'Grabado',
    'Arte digital', 'Instalación', 'Performance', 'Arte textil',
    'Arte sonoro', 'Arte conceptual',
  ];
  
  selectedCategories: string[] = [];
  minPrice: number = 0;
  maxPrice: number = 0;
  estados: string[] = ['pending', 'in_auction', 'sold'];
  estadoSeleccionado: string[] = [];

  constructor(private artService: ArtService, private router: Router) {}

  ngOnInit(): void {
    this.getArts();
  }

  goToArtDetail(artId: string): void {
    this.router.navigate(['/artDetail/' + artId]);
  }

  getArts(): void {
    this.artService.getAllArtData().subscribe((data) => {
      this.listArt = data.map((item: any) => {
        // Solo procesar imagen si no está en cache
        if (!this.imageCache.has(item._id)) {
          this.processImageAsync(item);
        } else {
          item.imageSrc = this.imageCache.get(item._id);
        }
        return item;
      });
      this.applyFilter();
    });
  }

  /**
   * Procesa la imagen de forma asíncrona para no bloquear la UI
   */
  private processImageAsync(item: any): void {
    // Placeholder mientras se procesa
    item.imageSrc = 'assets/placeholder.jpg';
    item.isLoading = true;

    // Usar setTimeout para procesar en el siguiente tick
    setTimeout(() => {
      const bufferData = item.images?.[0]?.image?.data?.data;
      if (bufferData) {
        try {
          const base64 = this.bufferToBase64Optimized(bufferData);
          const imageSrc = `data:${item.images[0].image.contentType};base64,${base64}`;
          
          // Guardar en cache
          this.imageCache.set(item._id, imageSrc);
          item.imageSrc = imageSrc;
          item.isLoading = false;
        } catch (error) {
          console.error('Error procesando imagen:', error);
          item.imageSrc = 'assets/placeholder.jpg';
          item.isLoading = false;
        }
      } else {
        item.imageSrc = 'assets/placeholder.jpg';
        item.isLoading = false;
      }
    }, 0);
  }

  /**
   * Versión optimizada de conversión a Base64
   * Usa chunks para evitar bloquear la UI con arrays muy grandes
   */
  private bufferToBase64Optimized(buffer: number[]): string {
    const chunkSize = 8192; // Procesar en chunks de 8KB
    let binary = '';
    
    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      const bytes = new Uint8Array(chunk);
      
      for (let j = 0; j < bytes.length; j++) {
        binary += String.fromCharCode(bytes[j]);
      }
    }

    if (typeof btoa === 'function') {
      return btoa(binary);
    }
    return Buffer.from(binary, 'binary').toString('base64');
  }

  /**
   * Alternativa usando Web Workers (más avanzado)
   * Descomenta si quieres implementar procesamiento en background
   */
  /*
  private processImageWithWorker(item: any): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./image-processor.worker', import.meta.url));
      
      worker.postMessage({
        buffer: item.images?.[0]?.image?.data?.data,
        contentType: item.images?.[0]?.image?.contentType,
        itemId: item._id
      });
      
      worker.onmessage = ({ data }) => {
        item.imageSrc = data.imageSrc;
        item.isLoading = false;
        this.imageCache.set(item._id, data.imageSrc);
        worker.terminate();
      };
    } else {
      this.processImageAsync(item);
    }
  }
  */

  trackById(index: number, item: any): string {
    return item._id;
  }

  // Métodos de filtrado optimizados
  private debounceTimer: any;
  
  onSearchChange(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.applyFilter();
    }, 300); // Esperar 300ms después del último cambio
  }

  onCategoryChange(cat: string, checked: boolean): void {
    if (checked) {
      this.selectedCategories.push(cat);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
    }
    this.applyFilter();
  }

  onStateChange(cat: string, checked: boolean): void {
    if (checked) {
      this.estadoSeleccionado.push(cat);
    } else {
      this.estadoSeleccionado = this.estadoSeleccionado.filter(c => c !== cat);
    }
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = [...this.listArt];

    // Filtro por título
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term)
      );
    }

    // Filtro por artista
    if (this.searchArtistTerm.trim()) {
      const term = this.searchArtistTerm.trim().toLowerCase();
      filtered = filtered.filter(item => 
        item.artist.toLowerCase().includes(term)
      );
    }

    // Filtro por categorías
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        this.selectedCategories.includes(item.category)
      );
    }

    // Filtro por estado
    if (this.estadoSeleccionado.length > 0) {
      filtered = filtered.filter(item => 
        this.estadoSeleccionado.includes(item.status)
      );
    }

    // Filtro por precio
    if (this.minPrice > 0 || this.maxPrice > 0) {
      filtered = filtered.filter(item => {
        const price = item.startingPrice ?? 0;
        const minOk = this.minPrice <= 0 || price >= this.minPrice;
        const maxOk = this.maxPrice <= 0 || price <= this.maxPrice;
        return minOk && maxOk;
      });
    }

    this.filteredList = filtered;
  }

  // Método para limpiar cache si es necesario
  clearImageCache(): void {
    this.imageCache.clear();
  }

  // Precargar imágenes visibles (lazy loading)
  onScrollNearEnd(): void {
    // Implementar lazy loading aquí si tienes muchas imágenes
    // Por ejemplo, cargar las siguientes 10 imágenes
  }
}