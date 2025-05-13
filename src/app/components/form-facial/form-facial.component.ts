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
  
  @Output() notificarDescriptor = new EventEmitter<{
    descritporFace: Float32Array | null;
    faceImageBase64: string;
  }>();

  recibirDescriptor({
    descritporFace,
    faceImageBase64,
  }: {
    descritporFace: Float32Array | null;
    faceImageBase64: string;
  }) {
    if (descritporFace !== null && faceImageBase64 !== '') {
      console.log(
        'recibirDescriptor desde el form facial',
        descritporFace,
        faceImageBase64
      );
    }
  }
}
