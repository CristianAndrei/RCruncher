import { ICommand } from '@nestjs/cqrs';

export class AddNewRedditPostCommand implements ICommand {
  constructor(public readonly redditUrl: string, public readonly body: string) { }
}
