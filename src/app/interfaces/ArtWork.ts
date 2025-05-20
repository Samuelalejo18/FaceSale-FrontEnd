export interface IArtwork {
  id?: string;
  title?: string;
  category?:
    | 'Pintura'
    | 'Escultura'
    | 'Fotografía'
    | 'Dibujo'
    | 'Grabado'
    | 'Arte digital'
    | 'Instalación'
    | 'Performance'
    | 'Arte textil'
    | 'Arte sonoro'
    | 'Arte conceptual';
  artist?: string;
  yearCreated?: Date;
  description?: string;
  technique?: string;
  dimensions?: {
    height_cm: number;
    width_cm: number;
    depth_cm?: number;
  };
  images?: {};
  startingPrice?: number;
  status?: 'pending' | 'in_auction' | 'sold';
  createdAt?: Date;
  updatedAt?: Date;
}
