import { Controller, Post, Body, Get } from '@nestjs/common';
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
            });
        });
    }
    @Post('createTopics')
    async createTopics(@Body('redditUserName') redditUserName: string) {
        const redditUserModel = new RedditUserModel();
        redditUserModel.name = redditUserName;
        from(this.commandBus.execute(
            new RenderTopicsForRedditUserCommand(redditUserModel))
        ).subscribe((newTopicsData) => { console.log('topic data:' + newTopicsData); });
    }
    @Get('network')
    async kNetwork() {
        this.kohonenNetwork.trainNetwork();
    }
    @Get('network1')
    async kNetwork1() {
        //const fields = 
        this.kohonenNetwork.seeNetwork();

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
}
