import { EventEmitter, Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceApiService {

  /**
    * Instancia global de face - api para usar sus métodos en toda la clase.
    * 
    */
  public globalFace: any;

  /**
  * EventEmitter que notifica cuando **todos** los modelos se han cargado.
  * Emite `true` al completarse la carga exitosamente.
  */
  cbModels: EventEmitter<any> = new EventEmitter<any>();


  /**
   * Array de promesas de carga de los modelos de face-api.
   * Carga:
   *  - ssdMobilenetv1 (detección de caras),
   *  - faceLandmark68Net (puntos de referencia faciales),
   *  - faceRecognitionNet (vectores de reconocimiento),
   *  - faceExpressionNet (detección de expresiones).
   * @private
   */
  private modelsForLoad = [
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
  ];

  /**
   * Constructor de la clase.
   * - Asigna la referencia global a face-api.
   * - Inicia la carga de los modelos.
   */
  constructor() {
    // Guardamos la librería en esta propiedad para usarla en otros métodos.
    this.globalFace = faceapi;

    // Llamada para cargar todos los modelos de forma asíncrona.

    this.loadModels();

  }

  /**
   * Carga todos los modelos necesarios para el reconocimiento facial.
   *
   * Utiliza `Promise.all` para ejecutar las promesas en paralelo y
   * esperar hasta que todas terminen de cargar. Si todos se cargan correctamente,
   * imprime un mensaje de éxito en la consola.
   *
   * @public
   * @returns {void}
   */
  public loadModels = () => {
    Promise.all(this.modelsForLoad)
      .then(() => {
      
        this.cbModels.emit(true);
          console.log('Modelos cargados!!');
      })
      .catch((error) => {
        console.log('Error al cargar los modelos:', error);
      });
  };
}



