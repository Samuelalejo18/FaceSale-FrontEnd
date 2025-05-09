import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FaceApiService } from '../../../services/face-api.service';
import { event } from 'jquery';
import { VideoPlayerService } from '../../../services/video-player.service';

@Component({
  selector: 'app-video-player',
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Input() stream: any;
  @Input() width!: number;
  @Input() height!: number;
  modelsReady!: boolean;
  listEvents: Array<any> = [];
  overCanvas: any;
  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService
  ) {}

  ngOnInit(): void {
    this.listenerEvents();
  }

  ngOnDestroy(): void {
    this.listEvents.forEach((event) => event.unsubscribe());
  }

  listenerEvents = () => {
    const observer1$ = this.faceApiService.cbModels.subscribe((res) => {
      //: TODO Los modelos estan ready!!
      this.modelsReady = true;

      this.checkFace();
    });

    const observer2$ = this.videoPlayerService.cbAi.subscribe(
      ({ resizedDetections, displaySize, expressions, eyes, videoElement }) => {
        resizedDetections = resizedDetections[0] || null;
        //! Vamos a pintar el canvas
        if (resizedDetections) {
          this.drawFace(resizedDetections, displaySize, eyes);
        }
      }
    );

    this.listEvents.push(observer1$, observer2$);
  };

  drawFace = (resizedDetections: any, displaySize: any, eyes: any) => {
    const { globalFace } = this.faceApiService;
    this.overCanvas
      .getContext('2d')
      .clearRect(0, 0, displaySize.width, displaySize.height);
    globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);
    globalFace.draw.drawDetections(this.overCanvas, resizedDetections);
  };

  checkFace() {
    setInterval(async () => {
      await this.videoPlayerService.getLandMark(this.videoElement);
    }, 50);
  }

  listenerplay() {
    const { globalFace } = this.faceApiService;
    this.overCanvas = globalFace.createCanvasFromMedia(
      this.videoElement.nativeElement
    );
    this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-over');
    this.renderer2.setStyle(this.overCanvas, 'width', `${this.width}px`);
    this.renderer2.setStyle(this.overCanvas, 'height', `${this.height}px`);
    // Estilos para que el canvas esté encima del video
    this.renderer2.setStyle(this.overCanvas, 'position', 'absolute');
    this.renderer2.setStyle(this.overCanvas, 'top', '0');
    this.renderer2.setStyle(this.overCanvas, 'left', '0');
    this.renderer2.setStyle(this.overCanvas, 'z-index', '10');
    this.renderer2.appendChild(this.elementRef.nativeElement, this.overCanvas);
  }
  loeadedMetaData() {
    this.videoElement.nativeElement.play();
  }
}
