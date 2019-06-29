import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data-services/data.service';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})
export class PostsPageComponent implements OnInit {
  public url;
  public postData;
  constructor(private readonly dataService: DataService) { }

  ngOnInit() {
  }
  vizualizePost() {
    this.dataService.getPostData(this.url).subscribe((data) => {
      const parsedData = JSON.parse(data.text);
      this.postData = parsedData;
      console.log(parsedData);
    });
  }
  public followUrl() {
    window.location.href = this.postData.url;
  }
}
