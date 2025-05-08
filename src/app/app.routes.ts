import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { PruebarutaProtejidaComponent } from './components/pruebaruta-protejida/pruebaruta-protejida.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    {
        path: "private",
        component: PruebarutaProtejidaComponent,
        canActivate: [authGuard]

    }
];
