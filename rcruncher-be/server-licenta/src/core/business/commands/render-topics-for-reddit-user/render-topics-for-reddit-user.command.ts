import { RedditUserModel } from '../../models/reddit-user.model';
import { ICommand } from '@nestjs/cqrs';

export class RenderTopicsForRedditUserCommand implements ICommand {
  constructor(public readonly redditUser: RedditUserModel) { }
}
