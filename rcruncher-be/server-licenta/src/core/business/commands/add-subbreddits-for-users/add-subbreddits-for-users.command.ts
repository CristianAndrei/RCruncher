import { RedditUserModel } from '../../models/reddit-user.model';

export class AddSubredditsForRedditUserCommand {
  constructor(public readonly redditUser: RedditUserModel) { }
}
