import { PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, Entity, Unique } from 'typeorm';
import { RedditCommentEntity } from './reddit.comment.entity';
import { RedditTopicEntity } from '../entities.exporter';
import { UserSubredditEntity } from './reddit.subreddits.entity';

@Entity()
@Unique(['name'])
export class RedditUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ default: '' })
    redditOauthToken: string;

    @Column({ default: '' })
    redditId: string;

    @Column({ default: '' })
    lastCommentFetchedID: string;

    @Column({ default: '' })
    lastUpvoteFetchedID: string;

    @Column({ default: '' })
    lastDownvoteFetchedID: string;

    @Column({ default: '' })
    lastSubmitFetchedID: string;

    @Column({ default: false })
    partOfTrainingSet: boolean;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    xPosition: number;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    yPosition: number;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    xDiference: number;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    yDiference: number;

    @OneToMany(type => RedditCommentEntity, redditCommentEntity => redditCommentEntity.owner)
    comments: RedditCommentEntity[];

    @OneToMany(type => RedditTopicEntity, redditTopicEntity => redditTopicEntity.owner)
    relatedTopics: RedditTopicEntity[];

    @OneToMany(type => UserSubredditEntity, userSubreddit => userSubreddit.owner)
    createdSubreddits: UserSubredditEntity[];
}
