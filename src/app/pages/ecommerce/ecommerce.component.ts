import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ArtService } from '../../services/art.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ecommerce',
  imports: [CommonModule],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css'],
})
export class EcommerceComponent implements OnInit {
  listArt: any[] = [];

  constructor(private artService: ArtService) {}

  ngOnInit(): void {
    this.artService.getAllArtData().subscribe((data) => {
      this.listArt = data.map((item: any) => {
        const bufferData = item.images?.[0]?.image?.data?.data;
        if (bufferData) {
          const base64 = this.bufferToBase64(bufferData);
          item.imageSrc = `data:${item.images[0].image.contentType};base64,${base64}`;
        } else {
          item.imageSrc = 'assets/placeholder.jpg'; // Imagen por defecto
        }
        return item;
      });
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
}
