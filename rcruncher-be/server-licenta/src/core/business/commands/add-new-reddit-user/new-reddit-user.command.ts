import { RedditUserModel } from '../../models/reddit-user.model';
import { ICommand } from '@nestjs/cqrs';

export class NewRedditUserCommand implements ICommand {
  constructor(public readonly redditUser: RedditUserModel) { }
}
