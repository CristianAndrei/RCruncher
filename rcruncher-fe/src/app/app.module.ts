import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FormsModule } from '@angular/forms';
import { NetworkPageComponent } from './pages/network-page/network-page.component';
import { PostsPageComponent } from './pages/posts-page/posts-page.component';
import { RoutingBarComponent } from './pages/routing-bar/routing-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NetworkPageComponent,
    PostsPageComponent,
    RoutingBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
