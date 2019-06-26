import { Column, ManyToOne, BaseEntity, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { RedditUserEntity } from './reddit.user.entity';

@Entity()
@Index(['topicName', 'owner'], { unique: true })
export class RedditTopicEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    topicName: string;

    @Column({ default: 0 })
    numberOfApp: number;

    @ManyToOne(type => RedditUserEntity, redditUserEntity => redditUserEntity.relatedTopics)
    owner: RedditUserEntity;

    static createNewTopic(topicName: string): RedditTopicEntity {
        const newTopic = new RedditTopicEntity();
        newTopic.topicName = topicName;
        return newTopic;
    }

}
