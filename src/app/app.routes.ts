import { Routes } from '@angular/router';

import { authGuard } from './guard/auth.guard';
import { FacialRecognitionComponent } from './components/facial-recognition/facial-recognition.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { PruebarutaProtejidaComponent } from './pages/pruebaruta-protejida/pruebaruta-protejida.component';
import { EcommerceComponent } from './pages/ecommerce/ecommerce.component';
import { ArtDetailComponent } from './pages/art-detail/art-detail.component';
import { PagoComponent } from './pages/pago/pago.component';
import { ActualizarPerfilComponent } from './pages/actualizar-perfil/actualizar-perfil.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'ecommerce', component: EcommerceComponent },
  {
    path: 'artDetail/:id',
    component: ArtDetailComponent,
    canActivate: [authGuard],
  },
  { path: 'face', component: FacialRecognitionComponent },
  { path: 'pago', component: PagoComponent },

  {
    path: 'private',
    component: PruebarutaProtejidaComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ActualizarPerfilComponent,
    canActivate: [authGuard],
  },
];
