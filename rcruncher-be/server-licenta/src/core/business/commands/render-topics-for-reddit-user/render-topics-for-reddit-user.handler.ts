import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedditUserEntity } from 'src/core/domain/entities/reddit-users/reddit.user.entity';
import { RenderTopicsForRedditUserCommand } from './render-topics-for-reddit-user.command';
import { RedditCommentEntity, RedditTopicEntity } from 'src/core/domain/entities/entities.exporter';
import { TextEnchancerService } from 'src/core/services/services.exporter';

@CommandHandler(RenderTopicsForRedditUserCommand)
export class RenderTopicsForRedditUserHandler implements ICommandHandler<RenderTopicsForRedditUserCommand> {
    constructor(private readonly textEnchancerService: TextEnchancerService) { }

    async execute(command: RenderTopicsForRedditUserCommand) {
        const { redditUser } = command;
        const redditCommentOwner = await RedditUserEntity.findOne({ where: { name: redditUser.name } });
        const notRenderedComments = await RedditCommentEntity.find({ where: {procesed: false, owner: redditCommentOwner}});

        if(redditCommentOwner.relatedTopics === undefined) {
            redditCommentOwner.relatedTopics = [];
        }

        for (const comment of notRenderedComments) {
            const commentTopics: any = await this.textEnchancerService.extractKeyWords(comment.body);

            for (const topic of commentTopics) {
                const newRedditTopicEntity: RedditTopicEntity = RedditTopicEntity.createNewTopic(topic, comment.subreddit);
                newRedditTopicEntity.owner = redditCommentOwner;
                redditCommentOwner.relatedTopics.push(newRedditTopicEntity);
                await newRedditTopicEntity.save();
            }
            comment.procesed = true;
            await comment.save();
        }
        await redditCommentOwner.save();
    }
}
