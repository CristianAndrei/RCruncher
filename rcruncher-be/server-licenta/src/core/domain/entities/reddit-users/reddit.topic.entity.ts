import { Column, ManyToOne, BaseEntity, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { RedditUserEntity } from './reddit.user.entity';

@Entity()
export class RedditTopicEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    topicName: string;

    @Column()
    subreddit: string;

    @ManyToOne(type => RedditUserEntity, redditUserEntity => redditUserEntity.relatedTopics)
    owner: RedditUserEntity;

    static createNewTopic(topicName: string, subreddit: string): RedditTopicEntity {
        const newTopic = new RedditTopicEntity();
        newTopic.topicName = topicName;
        newTopic.subreddit = subreddit;
        return newTopic;
    }

}
