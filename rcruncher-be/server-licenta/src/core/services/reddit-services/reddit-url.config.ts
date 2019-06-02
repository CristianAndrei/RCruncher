export class RedditRequestConfig {
    private limit: number = 50;
    private show: string = 'all';
    private type: string = 'comments';
    private t: 'all';

    public redditBaseApiUrl = 'api.reddit.com';

    public redditApiCommentsUrl(username: string) {
        return this.redditBaseApiUrl + '/user/' + username + '/comments';
    }
    public redditSubmittedUrl(username: string) {
        return this.redditBaseApiUrl + '/user/' + username + '/submitted';
    }
    public builddefaultQueryParams(before?: string): {} {
        const queryParams = {
            limit: this.limit,
            show: this.show,
            type: this.type,
            t: this.t,
        };
        return queryParams;
    }
    public buildQueryParamsBefore(before?: string): {} {
        const queryParams = {
            limit: this.limit,
            show: this.show,
            type: this.type,
            t: this.t,
        };
        if (before !== undefined) {
            queryParams['before'] = before;
        }
        return queryParams;
    }
    public buildQueryParamsAfter(after?: string): {} {
        const queryParams = {
            limit: this.limit,
            show: this.show,
            type: this.type,
            t: this.t,
        };
        if (after !== undefined) {
            queryParams['after'] = after;
        }
        return queryParams;
    }
}
