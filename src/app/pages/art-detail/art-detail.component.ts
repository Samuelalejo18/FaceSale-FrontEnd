import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArtService } from '../../services/art.service';
import { AuctionService } from '../../services/auction.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/User';
import { PagoComponent } from '../pago/pago.component';

@Component({
  selector: 'app-art-detail',
  imports: [CommonModule, FormsModule, HeaderComponent, PagoComponent],
  templateUrl: './art-detail.component.html',
  styleUrl: './art-detail.component.css',
})
export class ArtDetailComponent implements OnInit, OnDestroy {
  artwork: {
    title: string;
    category: string;
    artist: string;
    yearCreated: number | null;
    description: string;
    technique: string;
    dimensions: {
      height_cm: number | null;
      width_cm: number | null;
      depth_cm: number;
    };
    images: { image: { data: { data: number[] }; contentType: string } }[];
    startingPrice: number | null;
    status: string;
    imageSrc?: string;
  } = {
    title: '',
    category: '',
    artist: '',
    yearCreated: null,
    description: '',
    technique: '',
    dimensions: {
      height_cm: null,
      width_cm: null,
      depth_cm: 0,
    },
    images: [],
    startingPrice: null,
    status: '',
  };

  user: IUser | null = null;
  participants: any[] = [];

  auction = {
    _id: '',
    artworkId: null,
    status: '',
    startDate: null,
    endDate: null,
    participants: [],
    winner: null,
  };

  bidAmount: number = 0;
  minBidIncrement: number = 500000; // Incremento mínimo
  suggestedBid: number = 0;
  isAutoBidEnabled: boolean = false;
  maxAutoBid: number = 0;
  intervalId: any;
  searchTerm: string = '';
  id: string = '';

  showPaymentForm: boolean = false;
  isWinner: boolean = false;
  finalAmount: number = 0;
  paymentCompleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private artService: ArtService,
    private auctionService: AuctionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log('ID:', this.id);
    this.getArtById(this.id);
    this.getAuctionByIdArt(this.id);
    this.profile();
    
    this.intervalId = setInterval(() => {
      this.getAuctionByIdArt(this.id);
    }, 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  profile() {
    this.authService.verifyToken().subscribe({
      next: (response) => {
        this.user = response;
        console.log('Usuario logueado:', this.user);
      },
      error: (err) => {
        console.error('Error al verificar el token', err);
      },
    });
  }

  getArtById(id: string) {
    this.artService.getArtById(id).subscribe({
      next: (response) => {
        this.artwork = response;

        const bufferData = this.artwork.images?.[0]?.image?.data?.data;
        if (bufferData) {
          const base64 = this.bufferToBase64(bufferData);
          this.artwork.imageSrc = `data:${this.artwork.images[0].image.contentType};base64,${base64}`;
        } else {
          this.artwork.imageSrc = 'assets/placeholder.jpg';
        }
        console.log('Artwork cargado:', this.artwork);
      },
      error: (err) => {
        console.error('Error fetching art details:', err);
      },
    });
  }

 
  bufferToBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    if (typeof btoa === 'function') {
      return btoa(binary);
    }

    return Buffer.from(binary, 'binary').toString('base64');
  }

  getAuctionByIdArt(id: string) {
    this.auctionService.getAuctionByIdArt(id).subscribe({
      next: (response) => {
        this.auction = response;
        this.participants = response.participants || [];
        this.calculateSuggestedBid();
        this.checkIfUserIsWinner();
        console.log('Auction cargada:', this.auction);
        console.log('Estado de la subasta:', this.auction.status);
        console.log('¿Es activa?:', this.isAuctionActive());
      },
      error: (err) => {
        console.error('Error fetching auction details:', err);
      },
    });
  }

  checkIfUserIsWinner() {
    if (this.auction.status === 'finalizada' || this.auction.status === 'finished') {
      const userId = (this.user as any)?._id || (this.user as any)?.id;
      const highestBidder = this.getHighestBidderData();
      
      if (highestBidder && (highestBidder.userId === userId || highestBidder._id === userId)) {
        this.isWinner = true;
        this.finalAmount = this.getCurrentHighestBid();
        
        if (!this.paymentCompleted) {
          this.showWinnerMessage();
        }
      }
    }
  }

  getHighestBidderData(): any {
    if (!this.participants || this.participants.length === 0) {
      return null;
    }
    
    const highestBid = this.getCurrentHighestBid();
    return this.participants.find((p: any) => p.bidAmount === highestBid);
  }

  showWinnerMessage() {
    Swal.fire({
      icon: 'success',
      title: '¡Felicitaciones!',
      html: `
        <p>Has ganado la subasta por la obra: <strong>${this.artwork.title}</strong></p>
        <p>Monto final: <strong>$${this.finalAmount.toLocaleString()}</strong></p>
        <p>¿Deseas proceder con el pago?</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Proceder al Pago',
      cancelButtonText: 'Pagar Después',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showPaymentForm = true;
      }
    });
  }

  isAuctionActive(): boolean {
    const normalizedStatus = this.auction.status?.toLowerCase();
    return normalizedStatus === 'active' || normalizedStatus === 'activa';
  }
  calculateSuggestedBid() {
    const currentHighestBid = this.getCurrentHighestBid();
    this.suggestedBid = currentHighestBid + this.minBidIncrement;
    
    // Solo actualizar bidAmount si está vacío o es menor que la sugerida
    if (this.bidAmount === 0 || this.bidAmount < this.suggestedBid) {
      this.bidAmount = this.suggestedBid;
    }
  }

  showParticipants() {
    if (!this.participants || this.participants.length === 0) {
      this.participants = [];
      return;
    }

    // Recorrer participantes y extraer nombre y monto
    this.participants = this.participants.map((participant, index) => ({
      id: participant._id,
      name: participant.userName || `Usuario ${participant.userId.slice(-4)}`, // Si no hay nombre, usar parte del ID
      amount: participant.bidAmount,
      time: new Date(participant.bidTime),
      position: index + 1
    }));

    // Ordenar por monto descendente (mayor oferta primero)
    this.participants.sort((a, b) => b.amount - a.amount);
  }

  getCurrentHighestBid(): number {
    if (!this.participants || this.participants.length === 0) {
      return this.artwork.startingPrice || 0;
    }
    
    // Filtrar ofertas válidas y obtener la más alta
    const validBids = this.participants
      .map((p: any) => p.bidAmount || 0)
      .filter(bid => bid > 0);
      
    const highestBid = validBids.length > 0 ? Math.max(...validBids) : 0;
    return Math.max(highestBid, this.artwork.startingPrice || 0);
  }

  getHighestBidder(): string {
    if (!this.participants || this.participants.length === 0) {
      return '---';
    }
    
    const highestBid = this.getCurrentHighestBid();
    const highestBidder = this.participants.find((p: any) => p.bidAmount === highestBid);
    return highestBidder ? (highestBidder.userName || highestBidder.name) : '---';
  }

  increaseBid() {
    this.bidAmount += this.minBidIncrement;
  }

  decreaseBid() {
    const minAllowed = this.getCurrentHighestBid() + this.minBidIncrement;
    if (this.bidAmount > minAllowed) {
      this.bidAmount -= this.minBidIncrement;
    }
  }

  placeBid() {
    console.log('=== INICIANDO PROCESO DE OFERTA ===');
    console.log('Usuario:', this.user);
    console.log('Estado subasta:', this.auction.status);
    console.log('¿Es activa?:', this.isAuctionActive());
    console.log('Monto a ofertar:', this.bidAmount);

    if (!this.user) {
      Swal.fire({
        icon: 'warning',
        title: 'Debe iniciar sesión',
        text: 'Para participar en la subasta debe estar autenticado',
        confirmButtonText: 'OK',
      });
      return;
    }

    // CAMBIO PRINCIPA: Normalizar la validación del estado
    if (!this.isAuctionActive()) {
      Swal.fire({
        icon: 'warning',
        title: 'Subasta no disponible',
        text: `Esta subasta está: ${this.auction.status}. Solo se puede ofertar en subastas activas.`,
        confirmButtonText: 'OK',
      });
      return;
    }

    const minBid = this.getCurrentHighestBid() + this.minBidIncrement;
    if (this.bidAmount < minBid) {
      Swal.fire({
        icon: 'warning',
        title: 'Oferta insuficiente',
        text: `La oferta mínima es de $${minBid.toLocaleString()}`,
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.bidAmount <= this.getCurrentHighestBid()) {
      Swal.fire({
        icon: 'warning',
        title: 'Oferta debe ser mayor',
        text: `Su oferta debe ser mayor a la actual: $${this.getCurrentHighestBid().toLocaleString()}`,
        confirmButtonText: 'OK',
      });
      return;
    }

    const bidData = {
      userId: (this.user as any)._id || (this.user as any).id,
      bidAmount: this.bidAmount
    };

    console.log('Datos de oferta a enviar:', bidData);
    this.toBid(this.auction._id, bidData);
  }

  toBid(id: string, data: { userId: string; bidAmount: number }) {
    console.log('=== ENVIANDO OFERTA AL BACKEND ===');
    console.log('ID Subasta:', id);
    console.log('Datos:', data);
    
    this.auctionService.updateAuctionBid(id, data).subscribe({
      next: (response) => {
        this.auction = response;
        this.participants = response.participants || [];
        this.calculateSuggestedBid();
        
        Swal.fire({
          icon: 'success',
          title: '¡Oferta realizada!',
          text: `Su oferta de $${data.bidAmount.toLocaleString()} ha sido registrada exitosamente`,
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        console.error('=== ERROR EN OFERTA ===');
        console.error('Error completo:', err);
        console.error('Status:', err.status);
        console.error('Error body:', err.error);
        
        let errorMessage = 'Hubo un problema al procesar su oferta';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        } else if (err.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else if (err.status >= 500) {
          errorMessage = 'Error interno del servidor. Intente nuevamente.';
        } else if (err.status === 404) {
          errorMessage = 'Subasta no encontrada.';
        } else if (err.status === 401) {
          errorMessage = 'No está autorizado para realizar esta acción.';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error al realizar oferta',
          text: errorMessage,
          confirmButtonText: 'OK',
        });
      },
    });
  }

  getAuctionDuration(): string {
    if (!this.auction.endDate) return 'Fecha no disponible';

    const now = new Date();
    const endDate = new Date(this.auction.endDate);

    if (now >= endDate) {
      if (this.auction.status !== 'finalizada') {
        this.finalizeAuction();
      }
      return 'Subasta finalizada';
    }

    const diff = endDate.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let result = '';
    if (days > 0) result += `${days} día${days > 1 ? 's' : ''} `;
    if (hours > 0) result += `${hours} hora${hours > 1 ? 's' : ''} `;
    if (minutes > 0) result += `${minutes} minuto${minutes > 1 ? 's' : ''}`;

    return result.trim() || 'Menos de 1 minuto';
  }

  private finalizeAuction() {
    this.auctionService.updateAuctionFinalize(this.auction._id).subscribe({
      next: (response) => {
        this.auction.status = 'finalizada';
        Swal.fire({
          icon: 'success',
          title: '¡Subasta finalizada!',
          text: response.message,
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        console.error('Error finalizing auction:', err);
        Swal.fire({
          icon: 'warning',
          title: 'Subasta finalizada',
          text: err.error?.message || 'La subasta ha finalizado',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  applyFilter() {
    console.log('Searching for:', this.searchTerm);
  }

  openPaymentForm() {
    this.showPaymentForm = true;
  }

  closePaymentForm() {
    this.showPaymentForm = false;
  }

  // Simular procesamiento de pago
  processPayment(paymentData: any) {
    console.log('Procesando pago:', paymentData);
    
    Swal.fire({
      title: 'Procesando Pago...',
      text: 'Por favor espere mientras procesamos su pago',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      this.paymentCompleted = true;
      this.showPaymentForm = false;
      
      Swal.fire({
        icon: 'success',
        title: '¡Pago Exitoso!',
        html: `
          <p>Su pago ha sido procesado correctamente.</p>
          <p><strong>Obra:</strong> ${this.artwork.title}</p>
          <p><strong>Monto:</strong> $${this.finalAmount.toLocaleString()}</p>
          <p>Recibirá un email con los detalles de la compra.</p>
        `,
        confirmButtonText: 'Continuar'
      });
    }, 3000);
  }


  processImmediatePayment(bidAmount: number) {
  console.log('=== PROCESANDO PAGO INMEDIATO ===');
  console.log('Monto de la oferta:', bidAmount);
  
  this.finalAmount = bidAmount;
  this.isWinner = true;
  
  Swal.fire({
    icon: 'success',
    title: '¡Oferta Exitosa!',
    html: `
      <p>Su oferta de <strong>${bidAmount.toLocaleString()}</strong> ha sido registrada.</p>
      <p><strong>Obra:</strong> ${this.artwork.title}</p>
      <p>Ahora debe proceder con el pago para confirmar su compra.</p>
    `,
    showCancelButton: false,
    confirmButtonText: 'Proceder al Pago',
    confirmButtonColor: '#28a745',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.showPaymentForm = true;
      console.log('Mostrando formulario de pago inmediato');
    }
  });
}

forceFinishAuction() {
  console.log('=== FORZANDO FINALIZACIÓN DE SUBASTA ===');
  
  Swal.fire({
    title: '¿Finalizar subasta?',
    text: 'Esto es solo para pruebas. ¿Desea finalizar la subasta manualmente?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, finalizar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.auction.status = 'finalizada';
      this.checkIfUserIsWinner();
      
      Swal.fire({
        icon: 'success',
        title: 'Subasta finalizada',
        text: 'La subasta ha sido finalizada'
      });
    }
  });
}

  onPaymentSubmit(event: any) {
    const paymentData = {
      artwork: this.artwork,
      amount: this.finalAmount,
      paymentMethod: {
        cardNumber: event.numeroTarjeta,
        cardName: event.nombreTarjeta,
        expirationMonth: event.mesExpiracion,
        expirationYear: event.yearExpiracion,
        ccv: event.ccv
      },
      user: this.user,
      auctionId: this.auction._id
    };

    this.processImmediatePayment(this.bidAmount);
  }
}