import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data-services/data.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public appData;
  public newUser;
  public newPost;
  constructor(private readonly dataService: DataService) {
  }
  ngOnInit() {
    this.gatherData();
  }
  gatherData() {
    this.dataService.getApplicationData().subscribe((data) => {
      const parsedData = JSON.parse(data.text);
      this.appData = parsedData;
      console.log(parsedData);
    });
  }
  addUser() {
    this.dataService.createUser(this.newUser).subscribe(() => { });
    this.gatherData();
  }
  addPost() {
    this.dataService.analyzePost(this.newPost).subscribe(() => { });
    this.gatherData();
  }
}
