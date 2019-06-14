import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshSubredditsForUser } from './refresh-subreddits-for-user.command';
import { RedditDataService, sleeper, TextEnchancerService } from 'src/core/services/services.exporter';
import { RedditUserEntity, RedditCommentEntity } from 'src/core/domain/entities/entities.exporter';
import { UserSubredditEntity } from 'src/core/domain/entities/reddit-users/reddit.subreddits.entity';

@CommandHandler(RefreshSubredditsForUser)
export class RefreshSubredditsForUserHandler implements ICommandHandler<RefreshSubredditsForUser> {
    constructor(
        private readonly redditDataService: RedditDataService,
    ) { }

    async execute(command: RefreshSubredditsForUser) {
        const { redditUser } = command;

        const redditPostOwner = await RedditUserEntity.findOne(
            {
                where: { name: redditUser.name },
                relations: ['createdSubreddits'],
            },
        );

        let stillPostsLeft: boolean = true;
        let beforeId: string = redditPostOwner.lastSubmitFetchedID;
        let actualId: string;
        do {
            await sleeper().then(() => this.getOneBatchOfComments
                (redditPostOwner, beforeId).then((data) => {
                    stillPostsLeft = data[0]; beforeId = data[1];
                    if (beforeId !== '') {
                        actualId = beforeId;
                    }
                }));
        } while (stillPostsLeft);
        redditPostOwner.lastSubmitFetchedID = actualId;
        redditPostOwner.save();
    }
    getOneBatchOfComments(redditPostOwner: RedditUserEntity, beforeId: string): Promise<any> {
        return new Promise((resolve) => {
            this.redditDataService.getRedditUserSubmitted(redditPostOwner.name).subscribe(async (data) => {
                const subredditData = data.body;
                let stillPostsLeft: boolean = true;
                if (!('data' in subredditData)) {
                    resolve([0, 0]);
                }

                const subreddits = subredditData.data.children;
                if (typeof subreddits !== 'undefined' && subreddits.length > 0) {
                    if (redditPostOwner.redditId === '') {
                        redditPostOwner.redditId = subreddits[0].data.author_fullname;
                    }
                    if (redditPostOwner.lastSubmitFetchedID === '') {
                        redditPostOwner.lastSubmitFetchedID = subreddits[0].data.name;
                    }

                    for (const subreddit of subreddits) {
                        const subredditEntity = await UserSubredditEntity.
                            findOne({
                                where:
                                {
                                    origin: subreddit.data.subreddit,
                                    owner: redditPostOwner,
                                },
                            });
                        if (subreddit.data.name === beforeId) {
                            stillPostsLeft = false;
                            resolve([false, '']);
                        }
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
                    await redditPostOwner.save();
                    resolve([stillPostsLeft, subreddits[0].data.name]);
                } else {
                    resolve([false, '']);
                }
            });
        });
    }
}