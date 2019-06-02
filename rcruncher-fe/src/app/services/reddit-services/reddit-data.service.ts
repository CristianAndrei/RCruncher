import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { post, get } from 'superagent';
import { RedditOauthEngine } from './reddit-auth.service';
@Injectable({
    providedIn: 'root',
})
export class RedditDataEngine {
    private readonly superAgent;
    constructor(private redditOauthEngine: RedditOauthEngine) {
    }
    createUserDataListing(username: string): {} {
        const listing = {
            context : 2,
            show : '',
            sort : 'new',
            t : 'all',
            type : 'comments',
            username,
            count : 0,
            include_categories : true,
            limit : 50
        };
        return listing;
    }



    /*obtainDataForAccount(): Observable<any> {
      const basicURI = 'https://oauth.reddit.com/api/v1/me';
      return from(get(basicURI)
        .set('Authorization', this.getOauthAuthorization()));
    }*/
    obtainAccountComments(): Observable<any> {
      const basicURI = 'https://reddit.com/user/username/about';
      return from(get(basicURI)
        .set('Authorization', this.redditOauthEngine.getOauthAuthorization())
      );
    }
    /*obtainHotTopics(): Observable<any> {
      const basicURI = 'https://reddit.com/hot';
      return from(get(basicURI)
        .set('Authorization', this.getOauthAuthorization())
        .query({ g: 'Global'} )
      );
    }*/
} 