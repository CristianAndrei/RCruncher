import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommentsForUser } from './refresh-comments-for-user.command';
import { RedditDataService, sleeper } from 'src/core/services/services.exporter';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';

@CommandHandler(RefreshCommentsForUser)
export class AddSubredditsForRedditUserHandler implements ICommandHandler<RefreshCommentsForUser> {
    constructor(private readonly redditDataService: RedditDataService) { }

    async execute(command: RefreshCommentsForUser) {
        const { redditUser } = command;

        const redditCommentOwner = await RedditUserEntity.findOne(
            {
                where: { name: redditUser.name },
                relations: ['comments'],
            },
        );

        let stillCommentsLeft: boolean = true;
        let beforeId: string;

        do {
            await sleeper().then(() => this.getOneBatchOfComments
            (redditCommentOwner, beforeId).then((data) => {
                stillCommentsLeft = data[0]; beforeId = data[1];
            }));
        } while (stillCommentsLeft);

    }
    getOneBatchOfComments(redditCommentOwner: RedditUserEntity, beforeId: string): Promise<any> {
        return new Promise(() => {
            
        })
    }
}