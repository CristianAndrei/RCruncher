import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import {
    GoogleNaturalLanguageSentence,
    GoogleNaturalLanguageEntity,
    GoogleNaturalLanguageCategory,
} from './reddit-posts.exporter';

@Entity()
@Index(['url'], { unique: true })
export class RedditPostEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: ''})
    url: string;

    @Column({ default: '' })
    title: string;

    @Column({default: ''})
    language: string;

    @Column({ type: 'text'})
    body: string;

    @Column({ default: false })
    hasBeenProcessed: boolean;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    sentimentMagnitude: number;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    sentimentScore: number;

    @OneToMany(type => GoogleNaturalLanguageSentence, googleNaturalLanguageSentence => googleNaturalLanguageSentence.owner)
    sentences: GoogleNaturalLanguageSentence[];

    @OneToMany(type => GoogleNaturalLanguageEntity, googleNaturalLanguageEntity => googleNaturalLanguageEntity.owner)
    entities: GoogleNaturalLanguageEntity[];

    @OneToMany(type => GoogleNaturalLanguageCategory, googleNaturalLanguageCategory => googleNaturalLanguageCategory.owner)
    categories: GoogleNaturalLanguageCategory[];
}
