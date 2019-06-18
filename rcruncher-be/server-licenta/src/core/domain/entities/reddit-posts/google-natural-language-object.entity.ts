import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RedditPostEntity } from './reddit-posts.exporter';

@Entity()
export class GoogleNaturalLanguageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    name: string;

    @Column({ default: '' })
    type: string;

    @Column({ type: 'float', precision: 10, scale: 6, default: 0 })
    salience: number;

    @Column({ default: '' })
    metadataWikipediaUrl: string;

    @ManyToOne(type => RedditPostEntity, redditPostEntity => redditPostEntity.sentences)
    owner: RedditPostEntity;

    public static createObject(entityData): GoogleNaturalLanguageEntity {
        const newEntity = new GoogleNaturalLanguageEntity();
        if ('name' in entityData) {
            newEntity.name = entityData.name;
        }
        if ('type' in entityData) {
            newEntity.type = entityData.type;
        }
        if ('salience' in entityData) {
            newEntity.salience = entityData.salience;
        }
        if ('metadata' in entityData) {
            if ('wikipedia_url' in entityData.metadata) {
                newEntity.metadataWikipediaUrl = entityData.metadata.wikipedia_url;
            }
        }
        return newEntity;
    }

}
