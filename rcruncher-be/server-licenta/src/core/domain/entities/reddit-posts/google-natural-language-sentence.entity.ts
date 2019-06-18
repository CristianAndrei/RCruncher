import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne,  } from 'typeorm';
import { RedditPostEntity } from './reddit-post.entity';

@Entity()
export class GoogleNaturalLanguageSentence extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text'})
    textContent: string;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    sentimentMagnitude: number;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    sentimentScore: number;

    @ManyToOne(type => RedditPostEntity, redditPostEntity => redditPostEntity.sentences)
    owner: RedditPostEntity;

    public static createObject(sentenceData): GoogleNaturalLanguageSentence {
        const newSentence = new GoogleNaturalLanguageSentence();
        if ('text' in sentenceData) {
            if ('content' in sentenceData.text) {
                newSentence.textContent = sentenceData.text.content;
            }
        }
        if ('sentiment' in sentenceData) {
            if ('magnitude' in sentenceData.sentiment) {
                newSentence.sentimentMagnitude = sentenceData.sentiment.magnitude;
            }
            if ('score' in sentenceData.sentiment) {
                newSentence.sentimentScore = sentenceData.sentiment.score;
            }
        }
        return newSentence;
    }
}
