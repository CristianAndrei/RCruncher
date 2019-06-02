import { RedditUserModel } from '../../models/reddit-user.model';

export class AddCommentsForFirstTimeRedditUserCommand {
  constructor(public readonly redditUser: RedditUserModel) { }
}
