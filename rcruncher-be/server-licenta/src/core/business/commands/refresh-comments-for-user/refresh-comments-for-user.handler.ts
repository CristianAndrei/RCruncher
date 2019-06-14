import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommentsForUser } from './refresh-comments-for-user.command';
import { RedditDataService, sleeper, TextEnchancerService } from 'src/core/services/services.exporter';
import { RedditUserEntity, RedditCommentEntity } from 'src/core/domain/entities/entities.exporter';

@CommandHandler(RefreshCommentsForUser)
export class RefreshCommentsForUserHandler implements ICommandHandler<RefreshCommentsForUser> {
    constructor(
        private readonly redditDataService: RedditDataService,
        private readonly textEnchancerService: TextEnchancerService,
    ) { }

    async execute(command: RefreshCommentsForUser) {
        const { redditUser } = command;

        const redditCommentOwner = await RedditUserEntity.findOne(
            {
                where: { name: redditUser.name },
                relations: ['comments'],
            },
        );

        let stillCommentsLeft: boolean = true;
        let beforeId: string = redditCommentOwner.lastCommentFetchedID;
        let actualId: string;
        do {
            await sleeper().then(() => this.getOneBatchOfComments
                (redditCommentOwner, beforeId).then((data) => {
                    stillCommentsLeft = data[0]; beforeId = data[1];
                    if (beforeId !== '') {
                        actualId = beforeId;
                    }
                }));
        } while (stillCommentsLeft);
        redditCommentOwner.lastCommentFetchedID = actualId;
        redditCommentOwner.save();
    }
    getOneBatchOfComments(redditCommentOwner: RedditUserEntity, beforeId: string): Promise<any> {
        return new Promise((resolve) => {
            this.redditDataService.updateCommentsForRedditUser(redditCommentOwner.name, beforeId).subscribe
                (async (retrivedData) => {
                    let stillCommentsLeft = true;
                    if (!('text' in retrivedData)) {
                        resolve([0, 0]);
                    }

                    if (!('data' in JSON.parse(retrivedData.text))) {
                        resolve([0, 0]);
                    }

                    const dataJson = JSON.parse(retrivedData.text).data;
                    const comments = dataJson.children;

                    if (typeof comments !== 'undefined' && comments.length > 0) {
                        for (const comment of comments) {
                            const newComment = RedditCommentEntity.createNewComment(
                                comment.kind + '_' + comment.data.id,
                                this.textEnchancerService.removeUnwantedSubstrings(comment.data.body),
                                comment.data.subreddit_id,
                                comment.data.ups,
                                comment.data.downs);

                            if (comment.data.name === beforeId) {
                                stillCommentsLeft = false;
                                resolve([false, '']);
                            }
                            newComment.owner = redditCommentOwner;
                            await newComment.save();
                            redditCommentOwner.comments.push(newComment);
                        }
                        redditCommentOwner.save();
                        resolve([stillCommentsLeft, comments[0].data.name]);
                    } else {
                        resolve([false, '']);
                    }

                });
        });
    }
}