import { Component } from '@angular/core';
import { FacialRecognitionComponent } from '../facial-recognition/facial-recognition.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-facial',
  imports: [CommonModule, FacialRecognitionComponent],
  templateUrl: './form-facial.component.html',
  styleUrl: './form-facial.component.css',
})
export class FormFacialComponent {
  showFacialRecognition = false;
}
