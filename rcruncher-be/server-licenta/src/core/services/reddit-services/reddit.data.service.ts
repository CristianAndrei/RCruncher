import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { get } from 'superagent';
import { RedditRequestConfig } from './reddit-url.config';

@Injectable()
export class RedditDataService {
  redditRequestConfig = new RedditRequestConfig();
  initCommentsForRedditUser(redditUserName: string, after?: string): Observable<any> {
    return from(get(this.redditRequestConfig.redditApiCommentsUrl(redditUserName))
      .query(this.redditRequestConfig.buildQueryParamsAfter(after)));
  }
  updateCommentsForRedditUser(redditUserName: string, before: string): Observable<any> {
    return from(get(this.redditRequestConfig.redditApiCommentsUrl(redditUserName))
      .query(this.redditRequestConfig.buildQueryParamsBefore(before)));
  }
  getRedditUserSubmitted(redditUserName: string): Observable<any> {
    return from(get(this.redditRequestConfig.redditSubmittedUrl(redditUserName))
      .query(this.redditRequestConfig.builddefaultQueryParams));
  }
}
