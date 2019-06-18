import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetRedditPostWithAssociatedDataQuery } from './get-reddit-post-with-associated-data.query';
import { RedditPostEntity } from 'src/core/domain/entities/reddit-posts/reddit-post.entity';

@QueryHandler(GetRedditPostWithAssociatedDataQuery)
export class GetRedditPostWithAssociatedDataHandler implements IQueryHandler<GetRedditPostWithAssociatedDataQuery>{
    async execute(query: GetRedditPostWithAssociatedDataQuery) {
        const redditPostWithData = await RedditPostEntity
            .findOne(
                {
                    where: {
                        name: query.redditPostName,
                    },
                    relations: ['sentences', 'entities', 'categories'],
                });
        return redditPostWithData;
    }
}
