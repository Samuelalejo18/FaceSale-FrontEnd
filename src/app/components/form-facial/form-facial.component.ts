import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() close = new EventEmitter<void>();
  @Output() notificarDescriptor = new EventEmitter<{
    descriptorFace: Float32Array | null;
    faceImageBase64: string;
  }>();

  recibirDescriptor({
    descriptorFace,
    faceImageBase64,
  }: {
    descriptorFace: Float32Array | null;
    faceImageBase64: string;
  }) {
    this.notificarDescriptor.emit({
      descriptorFace: descriptorFace,
      faceImageBase64: faceImageBase64,
    });

    if (descriptorFace !== null && faceImageBase64 !== '') {
     
      this.notificarDescriptor.emit({
        descriptorFace: descriptorFace,
        faceImageBase64: faceImageBase64,
      });
     
    }
  }
}
