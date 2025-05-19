import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArtService } from '../../services/art.service';
import { get } from 'jquery';

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

  applyFilter() {
    throw new Error('Method not implemented.');
  }
  searchTerm: string = '';

  id: string = '';

  constructor(private route: ActivatedRoute, private artService: ArtService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log('ID:', this.id);
    this.getArtById(this.id);
  }

  getArtById(id: string) {
    this.artService.getArtById(id).subscribe({
      next: (response) => {
        
        this.artwork = response;
        console.log('Artwork:', this.artwork);
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
}
