import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RedditUserEntity, RedditTopicEntity, RedditCommentEntity, RedditPostEntity } from 'src/core/domain/entities/entities.exporter';
import { GetApplicationDataQuery } from './get-application-data.query';
import { getRepository } from 'typeorm';
import { UserSubredditEntity } from 'src/core/domain/entities/reddit-users/reddit.subreddits.entity';
@QueryHandler(GetApplicationDataQuery)
export class GetApplicationDataHandler implements IQueryHandler<GetApplicationDataQuery> {
    async execute(query: GetApplicationDataQuery) {
        const userdata = await getRepository(RedditUserEntity).
            createQueryBuilder('users').
            select('count(*)', 'userNumber').
            getRawOne();

        const commData = await getRepository(RedditCommentEntity).
            createQueryBuilder('comm').
            select('count(*)', 'commNumber').
            getRawOne();

        const topicData = await getRepository(RedditTopicEntity).
            createQueryBuilder('topic').
            select('count(*)', 'topicNumber').
            getRawOne();

        const submittedData = await getRepository(UserSubredditEntity).
            createQueryBuilder('subreddits').
            select('count(*)', 'subredditNumber').
            getRawOne();

        const postData = await getRepository(RedditPostEntity).
            createQueryBuilder('posts').
            select('count(*)', 'postNumber').
            getRawOne();

        return  {
            numberOfUsers : userdata.userNumber,
            numberOfComms : commData.commNumber,
            numberOfTopics : topicData.topicNumber.commNumber,
            numberOfSubmitted : submittedData.subredditNumber,
            numberOfPosts : postData.postNumber,
        };
    }
}
