import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
import { GetTrainedUsersQuery } from './get-trained-users.query';
@QueryHandler(GetTrainedUsersQuery)
export class GetTrainedUsersHandler implements IQueryHandler<GetTrainedUsersQuery> {
    async execute(query: GetTrainedUsersQuery) {
        const trainingSet = await RedditUserEntity.find({ where: { partOfTrainingSet: true } });
        return trainingSet;
    }
}
