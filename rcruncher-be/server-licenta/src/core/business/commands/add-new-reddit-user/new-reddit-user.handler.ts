import { NewRedditUserCommand } from './new-reddit-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedditUserEntity } from 'src/core/domain/entities/reddit-users/reddit.user.entity';

@CommandHandler(NewRedditUserCommand)
export class NewRedditUserHandler implements ICommandHandler<NewRedditUserCommand> {
  constructor() {}

  async execute(command: NewRedditUserCommand) {
    const { redditUser } = command;
    const newRedditUser = new RedditUserEntity();
    newRedditUser.name = redditUser.name;
    newRedditUser.redditId = redditUser.redditId;
    newRedditUser.comments = [];
    newRedditUser.relatedTopics = [];
    newRedditUser.createdSubreddits = [];
    await newRedditUser.save();
  }
}
