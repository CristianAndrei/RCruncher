import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { RedditPostEntity } from './reddit-post.entity';
@Entity()
export class GoogleNaturalLanguageCategory extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    name: string;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    confidence: number;

    @ManyToOne(type => RedditPostEntity, redditPostEntity => redditPostEntity.categories)
    owner: RedditPostEntity;

    public static createObject(categoryData): GoogleNaturalLanguageCategory {
        const newCategory = new GoogleNaturalLanguageCategory();
        if ('name' in categoryData) {
            newCategory.name = categoryData.name;
        }
        if ('confidence' in categoryData) {
            newCategory.confidence = categoryData.confidence;
        }
        return newCategory;
    }
}