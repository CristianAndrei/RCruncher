import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTopicsForUserQuery } from './get-topics-for-user.query';
import { RedditUserEntity, RedditTopicEntity } from 'src/core/domain/entities/entities.exporter';
@QueryHandler(GetTopicsForUserQuery)
export class GetTopicsForUserHandler implements IQueryHandler<GetTopicsForUserQuery> {
    async execute(query: GetTopicsForUserQuery) {
        const redditUser = await  RedditUserEntity.findOne({ where: { name: query.redditUserName } });
        return RedditTopicEntity.find({where: {owner: redditUser}});
    }
}
