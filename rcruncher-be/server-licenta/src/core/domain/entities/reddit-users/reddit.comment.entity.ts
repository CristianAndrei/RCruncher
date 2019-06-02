import { Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, Entity } from 'typeorm';
import { RedditUserEntity } from './reddit.user.entity';
@Entity()
export class RedditCommentEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    redditId: string;

    @Column({type : 'text' })
    body: string;

    @Column({ default: '' })
    subreddit: string;

    @Column({ default: 0 })
    ups: number;

    @Column({ default: 0 })
    downs: number;

    @Column({default: false})
    procesed: boolean;

    @ManyToOne(type => RedditUserEntity, redditUserEntity => redditUserEntity.comments)
    owner: RedditUserEntity;

    static createNewComment(redditId: string, body: string, subreddit: string, ups: number, downs: number): RedditCommentEntity {
        const newComment = new RedditCommentEntity();
        newComment.redditId = redditId;
        newComment.body = body;
        newComment.subreddit = subreddit;
        newComment.ups = ups;
        newComment.downs = downs;
        newComment.procesed = false;
        return newComment;
    }
}
