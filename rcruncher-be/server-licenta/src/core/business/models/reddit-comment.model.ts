import { RedditUserModel } from './reddit-user.model';

export class RedditCommentModel {
    redditId: string;
    body: string;
    subreddit: string;
    ups: number;
    downs: number;
    public owner: RedditUserModel;
}