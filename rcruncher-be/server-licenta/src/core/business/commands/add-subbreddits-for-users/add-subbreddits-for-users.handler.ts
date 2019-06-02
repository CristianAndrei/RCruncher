import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddSubredditsForRedditUserCommand } from './add-subbreddits-for-users.command';
import { RedditDataService } from 'src/core/services/services.exporter';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
import { UserSubredditEntity } from 'src/core/domain/entities/reddit-users/reddit.subreddits.entity';

@CommandHandler(AddSubredditsForRedditUserCommand)
export class AddSubredditsForRedditUserHandler implements ICommandHandler<AddSubredditsForRedditUserCommand> {
    constructor(private readonly redditDataService: RedditDataService) { }

    async execute(command: AddSubredditsForRedditUserCommand) {
        const { redditUser } = command;
        const redditPostOwner = await RedditUserEntity.findOne({ where: { name: redditUser.name } });
        this.redditDataService.getRedditUserSubmitted(redditPostOwner.name).subscribe(async (data) => {
            const subredditData = JSON.parse(data.data);
            for (const subreddit of subredditData) {
                const subredditEntity = await UserSubredditEntity.findOne({ where: { origin: subreddit.data.subreddit, owner: redditPostOwner } });
                if (subredditEntity !== undefined) {
                    subredditEntity.numberOfAppearances++;
                    subredditEntity.save();
                } else {
                    const newSubreddit = new UserSubredditEntity();
                    newSubreddit.name = subreddit.data.title;
                    newSubreddit.numberOfAppearances = 1;
                    newSubreddit.origin = subreddit.data.subreddit;
                    newSubreddit.owner = redditPostOwner;
                    await newSubreddit.save();
                    redditPostOwner.creadetSubreddits.push(newSubreddit);
                }
            }
            redditPostOwner.save();
        });
    }
}
