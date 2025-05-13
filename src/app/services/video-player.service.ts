import { EventEmitter, Injectable } from '@angular/core';
import { FaceApiService } from './face-api.service';
import * as _ from 'lodash';

/**
 * Servicio encargado de analizar video en tiempo real y extraer características faciales
 * usando la librería face-api.js a través del servicio FaceApiService.
 */

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerService {
  /**
   * EventEmitter que emite los resultados de la detección facial,
   * incluyendo expresiones, ojos y detecciones redimensionadas.
   */

  cbAi: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Inyección del servicio FaceApiService, que contiene la referencia
   * global a face-api.js y la lógica de carga de modelos.
   */

  constructor(private faceApiService: FaceApiService) {}

  /**
   * Método principal que obtiene las marcas faciales (landmarks) y expresiones
   * de un elemento de video HTML. Extrae los ojos izquierdo y derecho y emite
   * los resultados para otros componentes interesados.
   *
   * @param videoElement - Elemento HTMLVideoElement con la cara en pantalla.
   * @returns {Promise<void>} - Promesa que resuelve cuando se completa el análisis.
   */

  getLandMark = async (videoElement: any) => {
    // Extrae la instancia global de face-api.js
    const { globalFace } = this.faceApiService;

    // Obtiene dimensiones del video en reproducción
    const { videoWidth, videoHeight } = videoElement.nativeElement;
    const displaySize = { width: videoWidth, height: videoHeight };

    // Detecta todas las caras con sus landmarks y expresiones
    const detectionsFaces = await globalFace
      .detectAllFaces(videoElement.nativeElement)
      .withFaceLandmarks()
      .withFaceExpressions();
    // console.log(detectionsFaces);
    //console.log('detectionsFaces', detectionsFaces);

    // Extrae landmarks (puntos de referencia) y expresiones de la primera cara detectada
    const landmark = detectionsFaces[0].landmarks || null;
    const expressions = detectionsFaces[0].expressions || null;

    // Obtiene las posiciones de los ojos (izquierdo y derecho)
    const eyeLeft = landmark.getLeftEye();
    const eyeRight = landmark.getRightEye();

    // Usa lodash para obtener el primer y último punto de cada ojo
    const eyes = {
      left: [_.head(eyeLeft), _.last(eyeLeft)],
      right: [_.head(eyeRight), _.last(eyeRight)],
    };

    // Redimensiona las detecciones para ajustarlas al tamaño del video original
    const resizedDetections = globalFace.resizeResults(
      detectionsFaces,
      displaySize
    );

    // Emite los resultados para que otros componentes los usen (por ejemplo, para renderizar)
    this.cbAi.emit({
      resizedDetections,
      displaySize,
      expressions,
      eyes,
      videoElement,
    });
  };

  captureDescriptor = async (videoElement: HTMLVideoElement): Promise<any> => {
    const { globalFace } = this.faceApiService;

    // Detectar una sola cara con su descriptor
    const detection = await globalFace
      .detectSingleFace(videoElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) throw new Error('No se detectó ningún rostro.');

    // Capturar imagen actual del video
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }

    const imageDataUrl = canvas.toDataURL('image/png');

    return {
      descriptor: detection.descriptor,
      imageDataUrl,
    };
  };
}
