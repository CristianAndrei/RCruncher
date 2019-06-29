import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-routing-bar',
  templateUrl: './routing-bar.component.html',
  styleUrls: ['./routing-bar.component.css']
})
export class RoutingBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  reddirectHome() {
    window.location.href = 'http://localhost:4200/home';
  }
  reddirectNetwork() {
    window.location.href = 'http://localhost:4200/network';
  }
  reddirectPosts() {
    window.location.href = 'http://localhost:4200/posts';
  }
}
