import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { FaceApiService } from '../../services/face-api.service';
import { VideoPlayerService } from '../../services/video-player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-facial-recognition',
  imports: [CommonModule, VideoPlayerComponent],
  templateUrl: './facial-recognition.component.html',
  styleUrl: './facial-recognition.component.css'
})
export class FacialRecognitionComponent implements OnInit, OnDestroy {


  public currentStream: any;
  public dimensionsVideo: any;
  overCanvas: any;
  listEvents: Array<any> = [];
  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService
  ) { }



  ngOnInit(): void {
    this.listenerEvents();
    this.checkmediaSource();
    this.getSizeCam();
  }
  ngOnDestroy(): void {
    this.listEvents.forEach(event => event.unsubscribe());
  }







  listenerEvents = () => {

    const observer2$ = this.videoPlayerService.cbAi.subscribe(({ resizedDetections,
      displaySize,
      expressions,
      eyes,
      videoElement }) => {
      resizedDetections = resizedDetections[0] || null;
      //! Vamos a pintar el canvas
      if (resizedDetections) {
        this.createCanvasPreview();
        this.drawFace(resizedDetections, displaySize);
      }

    })

    this.listEvents.push(observer2$);
  }

  createCanvasPreview = () => {
    if (!this.overCanvas) {

    }
  }



  drawFace(resizedDetections: any, displaySize: any) {
    if (this.overCanvas) {
      const { globalFace } = this.faceApiService;
      this.overCanvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
      globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);
    }

  }


  /**
   * Verifica si el navegador tiene acceso a dispositivos multimedia
   * (cámara en este caso) y, si lo permite el usuario, obtiene el stream de video.
   */
  checkmediaSource = () => {
    // Verifica que el navegador y el objeto mediaDevices estén disponibles
    if (navigator && navigator.mediaDevices) {

      // Solicita acceso solo al video (no al audio)
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        // Si el usuario concede permisos, guarda el stream en la propiedad currentStream
        this.currentStream = stream;
      }).catch(() => {
        // Si el usuario niega los permisos o hay un error, muestra un mensaje en consola
        console.log("ERROR NOT PERMISSIONS");
      });

    } else {
      // Si no se encuentra mediaDevices, se lanza un error en consola
      console.log("Error not found media divices");
    }
  };




  /**
   * Obtiene el tamaño (ancho y alto) del elemento con clase 'cam' en el DOM
   * y lo guarda en la propiedad dimensionsVideo.
   */
  getSizeCam = () => {
    // Selecciona el primer elemento del DOM con la clase 'cam'
    const elementCam = document.querySelector('.cam') as HTMLElement | null;

    // Verifica si el elemento existe
    if (elementCam) {
      // Obtiene las dimensiones del elemento usando getBoundingClientRect()
      const { width, height } = elementCam.getBoundingClientRect();

      // Imprime las dimensiones en consola
      console.log(width, height);

      // Asigna las dimensiones a la propiedad dimensionsVideo del componente/clase
      this.dimensionsVideo = { width, height };

    } else {
      // Si no se encuentra el elemento con clase 'cam', muestra un mensaje de error
      console.log("Element with class 'cam' not found.");
    }
  };


}
