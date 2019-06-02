import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserDataPageComponent } from './pages/user-data-page/user-data-page.component';

const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: 'home', component: HomePageComponent },
{ path: 'login', component: LoginPageComponent },
{ path: 'register', component: RegisterPageComponent },
{ path: 'user', component: UserDataPageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
