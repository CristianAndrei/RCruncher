import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import {
    NewRedditUserCommand, AddCommentsForFirstTimeRedditUserCommand, RenderTopicsForRedditUserCommand, AddSubredditsForRedditUserCommand,
} from 'src/core/business/commands/command.exporter';
import { RedditUserModel } from 'src/core/business/models/reddit-user.model';
import { CommandBus } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { KohonenNetwork } from 'src/core/services/machine-learning-services/kohonen-network';
import { RefreshCommentsForUser } from 'src/core/business/commands/refresh-comments-for-user/refresh-comments-for-user.command';
import { sleeper } from 'src/core/services/services.exporter';
import { RefreshSubredditsForUser } from 'src/core/business/commands/refresh-subreddits-for-user/refresh-subreddits-for-user.command';

@Controller('reddit-users')
export class RedditUsersController {
    private kohonenNetwork = new KohonenNetwork();
    constructor(private readonly commandBus: CommandBus) { }

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
    @Get('network')
    async kNetwork() {
        this.kohonenNetwork.trainNetwork();
    }
    @Get('network1')
    async kNetwork1() {
        return this.kohonenNetwork.seeNetwork();
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
    @Get('predict')
    async predictUser(@Query('user') user) {
        this.kohonenNetwork.predictUser(user).subscribe((data) => { console.log(data) });
    }
}
