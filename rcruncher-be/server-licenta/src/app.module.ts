import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RedditUsersController } from './controllers/users/reddit-users.controller';
import { RedditDataService, TextEnchancerService, NaturalLanguageService, CrawlerService, PageContentRequester } from './core/services/services.exporter';
import { CqrsModule } from '@nestjs/cqrs';
import { RefreshSubredditsForUserHandler } from './core/business/commands/refresh-subreddits-for-user/refresh-subreddits-for-user.handler';
import {
  GetTopicsForUserHandler,
  GetTrainedUsersHandler,
  GetUserHandler,
  GetRedditPostWithAssociatedDataHandler,
} from './core/business/queries/query.exporter';
import { RedditPostsController } from './controllers/reddit-posts/reddit-posts.controller';
import {
  NewRedditUserHandler,
  AddCommentsForFirstTimeRedditUserHandler,
  RenderTopicsForRedditUserHandler,
  AddSubredditsForRedditUserHandler,
  RefreshCommentsForUserHandler,
  AddNewPostHandler,
} from './core/business/commands/command.exporter';

export const CommandHandlers = [
  NewRedditUserHandler,
  AddCommentsForFirstTimeRedditUserHandler,
  RenderTopicsForRedditUserHandler,
  AddSubredditsForRedditUserHandler,
  RefreshCommentsForUserHandler,
  RefreshSubredditsForUserHandler,
  AddNewPostHandler,
];

export const QuerryHandlers = [
  GetTopicsForUserHandler,
  GetTrainedUsersHandler,
  GetUserHandler,
  GetRedditPostWithAssociatedDataHandler,
];

@Module({
  imports: [TypeOrmModule.forRoot(), CqrsModule],
  controllers: [RedditUsersController, RedditPostsController],
  providers: [
    ...CommandHandlers,
    ...QuerryHandlers,
    RedditDataService,
    TextEnchancerService,
    NaturalLanguageService,
    CrawlerService,
    PageContentRequester,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
