import { RedditUserModel } from '../../models/reddit-user.model';
import { ICommand } from '@nestjs/cqrs';

export class RefreshSubredditsForUser implements ICommand {
  constructor(public readonly redditUser: RedditUserModel) { }
}
