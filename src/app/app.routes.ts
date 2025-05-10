import { Routes } from '@angular/router';

import { authGuard } from './guard/auth.guard';
import { FacialRecognitionComponent } from './components/facial-recognition/facial-recognition.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { PruebarutaProtejidaComponent } from './pages/pruebaruta-protejida/pruebaruta-protejida.component';


export const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },

    { path: "face", component: FacialRecognitionComponent },
    {
        path: "private",
        component: PruebarutaProtejidaComponent,
        canActivate: [authGuard]

    } 
];
