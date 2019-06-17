import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    async execute(query: GetUserQuery) {
        return RedditUserEntity.findOne({ where: { name: query.redditUserName } });
    }
}
