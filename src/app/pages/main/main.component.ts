// main.component.ts
import { Component, OnDestroy, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-main',
  imports: [RouterModule, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit, OnDestroy {
  menuAbierto = false;
  parallaxX: number = 0;
  parallaxY: number = 0;
  private animationFrameId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  ngOnDestroy(): void {
    // Cancelar cualquier animación pendiente
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Cancelar la animación anterior si existe
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Programar la actualización en el siguiente frame
    this.animationFrameId = requestAnimationFrame(() => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      
      // Normalizar las coordenadas del mouse (-1 a 1)
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      // Efecto parallax - movimiento suave en dirección opuesta al mouse
      this.parallaxX = -x * 20;  // Incrementé el valor para mayor efecto
      this.parallaxY = -y * 15;  // Incrementé el valor para mayor efecto
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
    });
  }

  alternarMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  getAstronautTransform(): string {
    // CAMBIO IMPORTANTE: Usar transform completo sin calc()
    return `translate(calc(-50% + ${this.parallaxX}px), calc(-50% + ${this.parallaxY}px))`;
  }

  getAstronautShadow(): string {
    // La sombra también se mueve ligeramente para dar profundidad
    const shadowX = 5 + this.parallaxX * 0.2;
    const shadowY = 15 + this.parallaxY * 0.2;
    return `drop-shadow(${shadowX}px ${shadowY}px 15px rgba(181, 150, 77, 0.6))`;
  }

  // Para los elementos de fondo decorativos - diferentes velocidades para crear profundidad
  getBackgroundElement1Transform(): string {
    return `translate(${this.parallaxX * 0.3}px, ${this.parallaxY * 0.2}px)`;
  }

  getBackgroundElement2Transform(): string {
    return `translate(${this.parallaxX * 0.5}px, ${this.parallaxY * 0.4}px)`;
  }

  getBackgroundElement3Transform(): string {
    return `translate(${this.parallaxX * 0.2}px, ${this.parallaxY * 0.3}px)`;
  }
}