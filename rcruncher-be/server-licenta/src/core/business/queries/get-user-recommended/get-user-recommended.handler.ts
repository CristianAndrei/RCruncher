import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
import { GetUserRecommendedQuery } from './get-user-recommended.query';
import { getRepository } from 'typeorm';
import { UserSubredditEntity } from 'src/core/domain/entities/reddit-users/reddit.subreddits.entity';
@QueryHandler(GetUserRecommendedQuery)
export class GetUserRecommendedHandler implements IQueryHandler<GetUserRecommendedQuery> {
    private diff = 15;
    async execute(query: GetUserRecommendedQuery) {
        const recommendedSubreddits = [];
        const relatedUsers = [];

        const redditUser = await RedditUserEntity.findOne({ where: { name: query.redditUserName } });
        const relatedData = await getRepository(RedditUserEntity).
            createQueryBuilder('users').
            select('users.name', 'name')
            .where('users.xPosition  > :xValueMin', { xValueMin: redditUser.xPosition - this.diff })
            .andWhere('users.xPosition < :xValueMax', { xValueMax: redditUser.xPosition + this.diff })
            .andWhere('users.yPosition < :yValueMax', { yValueMin: redditUser.yPosition - this.diff })
            .andWhere('users.yPosition < :yValueMax', { yValueMax: redditUser.yPosition + this.diff })
            .getRawMany();

        for (const user of relatedData) {
            const currentUser = await RedditUserEntity.findOne({ where: { name: user.name } });
            relatedUsers.push(currentUser.name);

            const topChoice = await UserSubredditEntity.find({ where: { owner: currentUser } });
            topChoice.sort((a, b): number => {
                if (a.numberOfAppearances > b.numberOfAppearances) {
                    return -1;
                }
                return 1;
            });
            let index = 0;
            while (index < 3 && index < topChoice.length) {
                recommendedSubreddits.push(topChoice[index].origin);
                index++;
            }
        }
        return {recommendedSubreddits , relatedUsers};
    }
}

/* .where('users.xPosition > :value', { value: redditUser.xPosition - this.diff })
                    .andWhere('users.xPosition < :value', { value: redditUser.xPosition + this.diff })
                    .where('users.yPosition > :value', { value: redditUser.yPosition - this.diff })
                    .andWhere('users.yPosition < :value', { value: redditUser.yPosition + this.diff }) */