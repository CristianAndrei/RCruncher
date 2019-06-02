import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedditUserEntity, RedditCommentEntity } from '../../../domain/entities/entities.exporter';
import { AddCommentsForFirstTimeRedditUserCommand } from './add-comments-for-first-time-reddit-user.command';
import { RedditDataService, TextEnchancerService } from 'src/core/services/services.exporter';

@CommandHandler(AddCommentsForFirstTimeRedditUserCommand)
export class AddCommentsForFirstTimeRedditUserHandler implements ICommandHandler<AddCommentsForFirstTimeRedditUserCommand> {
    constructor(
        private readonly redditDataService: RedditDataService,
        private readonly textEnchancerService: TextEnchancerService) { }

    private numberOfMonthsToFetch: number = 6;

    async execute(command: AddCommentsForFirstTimeRedditUserCommand) {
        const { redditUser } = command;

        const redditCommentOwner = await RedditUserEntity.findOne({ where: { name: redditUser.name } });

        const boundaryDate = new Date();
        boundaryDate.setMonth(boundaryDate.getMonth() - this.numberOfMonthsToFetch);

        await this.getOneBatchOfComments(redditCommentOwner, undefined);

    }
    async getOneBatchOfComments(redditCommentOwner: any, after: any) {

        this.redditDataService.initCommentsForRedditUser(redditCommentOwner.name, after).subscribe(
            async (retrivedData) => {
                const dataJson = JSON.parse(retrivedData.text).data;
                const comments = dataJson.children;

                if (redditCommentOwner.redditId === '') {
                    redditCommentOwner.redditId = comments[0].data.author_fullname;
                    redditCommentOwner.lastCommentFetchedID = comments[0].kind + '_' + comments[0].data.id;
                    redditCommentOwner.comments = [];
                    redditCommentOwner.relatedTopics = [];
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
            });

    }

}
