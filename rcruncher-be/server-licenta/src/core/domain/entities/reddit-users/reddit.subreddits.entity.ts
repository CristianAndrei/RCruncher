import { Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, Entity, Unique, Index } from 'typeorm';
import { RedditUserEntity } from './reddit.user.entity';

@Entity()
@Index(['origin', 'owner' ], { unique: true })
export class UserSubredditEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    numberOfAppearances: number;

    @Column()
    origin: string;

    @ManyToOne(type => RedditUserEntity, redditUserEntity => redditUserEntity.comments)
    owner: RedditUserEntity;
}
