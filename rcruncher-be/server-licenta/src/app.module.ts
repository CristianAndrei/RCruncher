import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RedditUsersController } from './controllers/users/reddit-users.controller';
import { RedditDataService, TextEnchancerService, KohonenNetwork } from './core/services/services.exporter';
import {
  NewRedditUserHandler,
  AddCommentsForFirstTimeRedditUserHandler,
  RenderTopicsForRedditUserHandler,
  AddSubredditsForRedditUserHandler,
  RefreshCommentsForUserHandler,
} from './core/business/commands/command.exporter';
import {CqrsModule } from '@nestjs/cqrs';
import { RefreshSubredditsForUserHandler } from './core/business/commands/refresh-subreddits-for-user/refresh-subreddits-for-user.handler';

export const CommandHandlers = [
  NewRedditUserHandler,
  AddCommentsForFirstTimeRedditUserHandler,
  RenderTopicsForRedditUserHandler,
  AddSubredditsForRedditUserHandler,
  RefreshCommentsForUserHandler,
  RefreshSubredditsForUserHandler,
];

@Module({
  imports: [TypeOrmModule.forRoot(), CqrsModule],
  controllers: [RedditUsersController],
  providers: [
    ...CommandHandlers,
    RedditDataService,
    TextEnchancerService,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
