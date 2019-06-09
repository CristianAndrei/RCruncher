import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedditUserEntity, RedditCommentEntity } from '../../../domain/entities/entities.exporter';
import { AddCommentsForFirstTimeRedditUserCommand } from './add-comments-for-first-time-reddit-user.command';
import { RedditDataService, TextEnchancerService, sleeper } from 'src/core/services/services.exporter';

@CommandHandler(AddCommentsForFirstTimeRedditUserCommand)
export class AddCommentsForFirstTimeRedditUserHandler implements ICommandHandler<AddCommentsForFirstTimeRedditUserCommand> {
    constructor(
        private readonly redditDataService: RedditDataService,
        private readonly textEnchancerService: TextEnchancerService) { }

    private numberOfMonthsToFetch: number = 6;

    async execute(command: AddCommentsForFirstTimeRedditUserCommand) {
        const { redditUser } = command;

        const redditCommentOwner = await RedditUserEntity.findOne(
            {
                where: { name: redditUser.name },
                relations: ['comments'],
            },

        );

        let commentDate;
        let afterId;
        const boundaryDate = new Date();
        boundaryDate.setMonth(boundaryDate.getMonth() - this.numberOfMonthsToFetch);
        const unixDate: number = parseInt((boundaryDate.getTime() / 1000).toFixed(0), 10);
        do {
            await sleeper().then(() => this.getOneBatchOfComments(
                redditCommentOwner, afterId).then((data) => { commentDate = data[0]; afterId = data[1]; }));
        } while (commentDate > unixDate);
    }
    getOneBatchOfComments(redditCommentOwner: any, after: any): Promise<any> {
        return new Promise((resolve) => {
            this.redditDataService.initCommentsForRedditUser(redditCommentOwner.name, after).subscribe(
                async (retrivedData) => {
                    if (!('text' in retrivedData)) {
                        resolve([0, 0]);
                    }

                    if (!('data' in JSON.parse(retrivedData.text))) {
                        resolve([0, 0]);
                    }

                    const dataJson = JSON.parse(retrivedData.text).data;
                    const comments = dataJson.children;

                    if (typeof comments !== 'undefined' && comments.length > 0) {

                        if (redditCommentOwner.redditId === '') {
                            redditCommentOwner.redditId = comments[0].data.author_fullname;
                            redditCommentOwner.lastCommentFetchedID = comments[0].kind + '_' + comments[0].data.id;
                        }
                        for (const comment of comments) {
                            const newComment = RedditCommentEntity.createNewComment(
                                comment.kind + '_' + comment.data.id,
                                this.textEnchancerService.removeUnwantedSubstrings(comment.data.body),
                                comment.data.subreddit_id,
                                comment.data.ups,
                                comment.data.downs);

                            newComment.owner = redditCommentOwner;
                            await newComment.save();
                            redditCommentOwner.comments.push(newComment);
                        }
                        const answer = [comments[comments.length - 1].data.created_utc, dataJson.after];
                        resolve(answer);
                    } else {
                        resolve([0, 0]);
                    }
                },
                (err) => { console.log('error in addCommentForFirstTimeUser handler') }
            );
        });

    }

}
