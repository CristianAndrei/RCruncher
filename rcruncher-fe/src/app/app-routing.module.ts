import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NetworkPageComponent } from './pages/network-page/network-page.component';
import { PostsPageComponent } from './pages/posts-page/posts-page.component';

const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: 'home', component: HomePageComponent },
{ path: 'network', component: NetworkPageComponent},
{ path: 'posts', component: PostsPageComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
