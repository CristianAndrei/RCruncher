import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import {
    NewRedditUserCommand, AddCommentsForFirstTimeRedditUserCommand, RenderTopicsForRedditUserCommand, AddSubredditsForRedditUserCommand,
} from 'src/core/business/commands/command.exporter';
import { RedditUserModel } from 'src/core/business/models/reddit-user.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { KohonenNetwork } from 'src/core/services/machine-learning-services/kohonen-network';
import { RefreshCommentsForUser } from 'src/core/business/commands/refresh-comments-for-user/refresh-comments-for-user.command';
import { sleeper } from 'src/core/services/services.exporter';
import { RefreshSubredditsForUser } from 'src/core/business/commands/refresh-subreddits-for-user/refresh-subreddits-for-user.command';
import { GetUserQuery, GetTopicsForUserQuery, GetTrainedUsersQuery } from 'src/core/business/queries/query.exporter';

@Controller('reddit-users')
export class RedditUsersController {
    private kohonenNetwork = new KohonenNetwork();
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
        this.kohonenNetwork.loadNetwork().subscribe(() => {
            console.log('Trained');
            sleeper(10000).then(() => {
                this.kohonenNetwork.trainNetwork();
            });
        });
    }

    @Post()
    async create(@Body('redditUserName') redditUserName: string) {

        const redditUserModel = new RedditUserModel();
        redditUserModel.name = redditUserName;
        try {
            from(this.commandBus.execute(
                new NewRedditUserCommand(redditUserModel),
            )).subscribe(async () => {
                from(this.commandBus.execute(
                    new AddCommentsForFirstTimeRedditUserCommand(redditUserModel),
                )).subscribe(() => {
                    sleeper().then(() => {
                        from(this.commandBus.execute(
                            new AddSubredditsForRedditUserCommand(redditUserModel)),
                        );
                    });
                    /*sleeper().then(() => {
                        from(this.commandBus.execute(
                            new RenderTopicsForRedditUserCommand(redditUserModel)),
                        );
                    }); */
                });
            });
        } catch (error) {
            console.log('User already exists');
        }
    }
    @Get('network1')
    async kNetwork1() {
        return this.kohonenNetwork.saveNetwork();
    }

    @Post('refreshTopics')
    async createTopics(@Body('redditUserName') redditUserName: string) {
        const redditUserModel = new RedditUserModel();
        redditUserModel.name = redditUserName;
    }
    @Post('refresh-comments')
    async refreshComments(@Body('redditUserName') redditUserName: string) {
        const redditUserModel = new RedditUserModel();
        redditUserModel.name = redditUserName;
        from(this.commandBus.execute(
            new RefreshCommentsForUser(redditUserModel),
        ),
        );
    }
    @Post('refresh-submitted')
    async refreshSubmitted(@Body('redditUserName') redditUserName: string) {
        const redditUserModel = new RedditUserModel();
        redditUserModel.name = redditUserName;
        from(this.commandBus.execute(
            new RefreshSubredditsForUser(redditUserModel),
        ),
        );
    }
    @Get('user/:user/predict')
    async predictUser(@Param() params) {
        return this.kohonenNetwork.predictUser(params.user);
    }
    @Get('user/:user')
    async getUserData(@Param() params) {
        return this.queryBus.execute(
            new GetUserQuery(params.user),
        );
    }
    @Get('user/:user/topics')
    async getUserTopics(@Param() params) {
        return this.queryBus.execute(
            new GetTopicsForUserQuery(params.user),
        );
    }
    @Get('trainingSet')
    async getTrainingSet() {
        return this.queryBus.execute(
            new GetTrainedUsersQuery(),
        );
    }
}
