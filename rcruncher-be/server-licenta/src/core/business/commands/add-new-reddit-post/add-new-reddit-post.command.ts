import { ICommand } from '@nestjs/cqrs';

export class AddNewRedditCommand implements ICommand {
  constructor(public readonly redditUrl: string, public readonly body: string) { }
}
