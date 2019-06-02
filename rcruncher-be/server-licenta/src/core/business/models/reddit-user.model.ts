import { RedditCommentModel } from './reddit-comment.model';

export class RedditUserModel {
    name: string;
    redditId: string;
    lastCommentFetchedID: string;
    lastUpvoteFetchedID: string;
    lastDownvoteFetchedID: string;
    lastSubmitFetchedID: string;
    public userComments: RedditCommentModel[] = new Array<RedditCommentModel>();
}