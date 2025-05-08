import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent }
];
