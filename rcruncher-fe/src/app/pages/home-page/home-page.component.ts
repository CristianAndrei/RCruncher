import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RedditOauthEngine } from 'src/app/services/reddit-services/reddit-auth.service';
import { RedditDataEngine } from 'src/app/services/reddit-services/reddit-data.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  private urlStateString = 'state';
  private urlCodeString = 'code';
  constructor(
    private route: ActivatedRoute,
    private redditOauthEngine: RedditOauthEngine,
    private redditDataEngine: RedditDataEngine,
    private router: Router) { }

  ngOnInit() {
    let state = '';
    let code = '';
    this.route.queryParams.subscribe(params => {
      state = params[this.urlStateString];
      code = params[this.urlCodeString];
      if (state !== undefined && code !== undefined) {
        console.log(state, code);
        this.redditOauthEngine.obtainOauthToken(code).subscribe((data) => {
          this.redditOauthEngine.oauthToken = data.body['access_token'];  // MODIFY THIS
          console.log(data.body['access_token']);
          this.router.navigate(['home']);
        });
      }
    });
  }
  getUserBasicData() {
    this.redditDataEngine.obtainAccountComments().subscribe((data) => { console.log(data); });
  }
}
