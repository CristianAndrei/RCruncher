import { Injectable} from '@angular/core';
import { Observable, from } from 'rxjs';
import { RedditConfig } from './reddit.config';
import { post, get } from 'superagent';
@Injectable({
    providedIn: 'root',
  })    
export class RedditOauthEngine {
  public oauthToken: string = '';
  private oauthURI: string = "https://www.reddit.com/api/v1/access_token";
  private readonly superAgent;
  constructor() {
  }
  private getEncodedCredentials(): string {
    return 'Basic ' + btoa(RedditConfig.appId + ':' + RedditConfig.appSecret);
  }
  public getOauthAuthorization(): string {
    return 'Bearer ' + this.oauthToken;
  }

  obtainOauthToken(c: string): Observable<any> {
    console.log(c);
    const bodyData = {
      grant_type: 'authorization_code',
      code: c,
      redirect_uri: 'http://localhost:4200/home'
    }
    return from(post(this.oauthURI)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', this.getEncodedCredentials())
      .send(bodyData));
  }
  /*obtainDataForAccount(): Observable<any> {
    const basicURI = 'https://oauth.reddit.com/api/v1/me';
    return from(get(basicURI)
      .set('Authorization', this.getOauthAuthorization()));
  }
  obtainAccountComments(): Observable<any> {
    const basicURI = 'https://reddit.com/user/username/comments';

    return from(get(basicURI)
      .set('Authorization', this.getOauthAuthorization())
      .query({ context: 3 , username : 'Cristian-Andrei'} )
    );
  }
  obtainHotTopics(): Observable<any> {
    const basicURI = 'https://reddit.com/hot';

    return from(get(basicURI)
      .set('Authorization', this.getOauthAuthorization())
      .query({ g: 'Global'} )
    );
  }*/
} 