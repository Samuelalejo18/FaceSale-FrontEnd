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
        console.log('Art details:', response);
      },
      error: (err) => {
        console.log('Error fetching art details:', err);
      },
    });
  }
}
