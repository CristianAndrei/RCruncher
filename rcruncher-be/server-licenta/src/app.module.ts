import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RedditUsersController } from './controllers/users/reddit-users.controller';
import { RedditDataService, TextEnchancerService } from './core/services/services.exporter';
import { CqrsModule } from '@nestjs/cqrs';
import { RefreshSubredditsForUserHandler } from './core/business/commands/refresh-subreddits-for-user/refresh-subreddits-for-user.handler';
import { GetTopicsForUserHandler, GetTrainedUsersHandler, GetUserHandler } from './core/business/queries/query.exporter';
import { RedditPostsController } from './controllers/reddit-posts/reddit-posts.controller';
import {
  NewRedditUserHandler,
  AddCommentsForFirstTimeRedditUserHandler,
  RenderTopicsForRedditUserHandler,
  AddSubredditsForRedditUserHandler,
  RefreshCommentsForUserHandler,
} from './core/business/commands/command.exporter';

export const CommandHandlers = [
  NewRedditUserHandler,
  AddCommentsForFirstTimeRedditUserHandler,
  RenderTopicsForRedditUserHandler,
  AddSubredditsForRedditUserHandler,
  RefreshCommentsForUserHandler,
  RefreshSubredditsForUserHandler,
];

export const QuerryHandlers = [
  GetTopicsForUserHandler,
  GetTrainedUsersHandler,
  GetUserHandler,
];

@Module({
  imports: [TypeOrmModule.forRoot(), CqrsModule],
  controllers: [RedditUsersController, RedditPostsController],
  providers: [
    ...CommandHandlers,
    ...QuerryHandlers,
    RedditDataService,
    TextEnchancerService,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
