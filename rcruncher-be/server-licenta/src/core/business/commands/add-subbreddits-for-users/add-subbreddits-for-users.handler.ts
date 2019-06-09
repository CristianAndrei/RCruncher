import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddSubredditsForRedditUserCommand } from './add-subbreddits-for-users.command';
import { RedditDataService, sleeper } from 'src/core/services/services.exporter';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
import { UserSubredditEntity } from 'src/core/domain/entities/reddit-users/reddit.subreddits.entity';

@CommandHandler(AddSubredditsForRedditUserCommand)
export class AddSubredditsForRedditUserHandler implements ICommandHandler<AddSubredditsForRedditUserCommand> {
    constructor(private readonly redditDataService: RedditDataService) { }
    private numberOfMonthsToFetch: number = 6;

    async execute(command: AddSubredditsForRedditUserCommand) {
        const { redditUser } = command;

        const redditPostOwner = await RedditUserEntity.
            findOne(
                {
                    where: { name: redditUser.name },
                    relations: ['createdSubreddits'],
                },
            );

        let commentDate;
        let afterId;
        const boundaryDate = new Date();
        boundaryDate.setMonth(boundaryDate.getMonth() - this.numberOfMonthsToFetch);
        const unixDate: number = parseInt((boundaryDate.getTime() / 1000).toFixed(0), 10);
        do {
            await sleeper().then(() => this.getOneBatchOfTopics(
                redditPostOwner, afterId).then((data) => { commentDate = data[0]; afterId = data[1]; }));
        } while (commentDate > unixDate);
    }
    getOneBatchOfTopics(redditPostOwner: any, after: any): Promise<any> {

        return new Promise((resolve) => {
            this.redditDataService.getRedditUserSubmitted(redditPostOwner.name).subscribe(async (data) => {
                const subredditData = data.body;

                if (!('data' in subredditData)) {
                    resolve([0, 0]);
                }

                const subreddits = subredditData.data.children;
                if (typeof subreddits !== 'undefined' && subreddits.length > 0) {
                    for (const subreddit of subreddits) {
                        const subredditEntity = await UserSubredditEntity.
                            findOne({
                                where:
                                {
                                    origin: subreddit.data.subreddit,
                                    owner: redditPostOwner,
                                },
                            });
                        if (subredditEntity !== undefined) {
                            subredditEntity.numberOfAppearances++;
                            subredditEntity.save();
                        } else {
                            const newSubreddit = new UserSubredditEntity();
                            newSubreddit.numberOfAppearances = 1;
                            newSubreddit.origin = subreddit.data.subreddit;
                            newSubreddit.owner = redditPostOwner;
                            await newSubreddit.save();
                            redditPostOwner.createdSubreddits.push(newSubreddit);
                        }
                    }
                    redditPostOwner.save();
                    resolve([subreddits[subreddits.length - 1].data.created_utc, subredditData.after]);
                } else {
                    resolve([0, 0]);
                }
            });
        });
    }
}
