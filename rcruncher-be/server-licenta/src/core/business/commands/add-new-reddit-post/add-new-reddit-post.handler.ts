import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddNewRedditPostCommand } from './add-new-reddit-post.command';
import { RedditPostEntity } from 'src/core/domain/entities/reddit-posts/reddit-post.entity';
import { NaturalLanguageService } from 'src/core/services/google-api-natural-language-services/google-api-natural-language.service';
import {
    GoogleNaturalLanguageEntity,
    GoogleNaturalLanguageSentence,
    GoogleNaturalLanguageCategory,
} from 'src/core/domain/entities/reddit-posts/reddit-posts.exporter';

@CommandHandler(AddNewRedditPostCommand)
export class AddNewPostHandler implements ICommandHandler<AddNewRedditPostCommand> {
    constructor(private readonly googleNaturalLanguageService: NaturalLanguageService) { }

    async execute(command: AddNewRedditPostCommand) {
        const newRedditPost = new RedditPostEntity();
        newRedditPost.url = command.redditUrl;
        newRedditPost.hasBeenProcessed = true;
        newRedditPost.body = command.body;

        if(command.body === undefined) {
            newRedditPost.body = '';
        }

        newRedditPost.categories = [];
        newRedditPost.entities = [];
        newRedditPost.sentences = [];

        this.googleNaturalLanguageService.analyzeEntities(command.body)
            .subscribe((requestData) => {
                const data = requestData.body;
                if ('entities' in data) {
                    for (const entity of data.entities) {
                        const newEntity = GoogleNaturalLanguageEntity.createObject(entity);
                        newEntity.owner = newRedditPost;
                        newRedditPost.entities.push(newEntity);
                        newEntity.save();
                    }
                }
            }, (err) => { console.log(err); }
            );
        this.googleNaturalLanguageService.analyzeSentiment(command.body)
            .subscribe((requestData) => {
                const data = requestData.body;
                if ('documentSentiment' in data) {
                    if ('magnitude' in data.documentSentiment) {
                        newRedditPost.sentimentMagnitude = data.documentSentiment.magnitude;
                    }
                    if ('score' in data.documentSentiment) {
                        newRedditPost.sentimentScore = data.documentSentiment.score;
                    }
                }
                if ('language' in data) {
                    newRedditPost.language = data.language;
                }
                if ('sentences' in data) {
                    for (const sentence of data.sentences) {
                        const newSentence = GoogleNaturalLanguageSentence.createObject(sentence);
                        newSentence.owner = newRedditPost;
                        newRedditPost.sentences.push(newSentence);
                        newSentence.save();
                    }
                }
            }, (err) => { console.log(err); }
            );
        this.googleNaturalLanguageService.classifyText(command.body)
            .subscribe((requestData) => {
                const data = requestData.body;
                if ('categories' in data) {
                    for (const category of data.categories) {
                        const newCategory = GoogleNaturalLanguageCategory.createObject(category);
                        newCategory.owner = newRedditPost;
                        newRedditPost.categories.push(newCategory);
                        newCategory.save();
                    }
                }
            },(err) => { console.log(err); });
        newRedditPost.save();
    }
}
