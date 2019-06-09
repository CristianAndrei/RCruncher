import { Controller, Post, Body, Get } from '@nestjs/common';
import {
    NewRedditUserCommand, AddCommentsForFirstTimeRedditUserCommand, RenderTopicsForRedditUserCommand, AddSubredditsForRedditUserCommand,
} from 'src/core/business/commands/command.exporter';
import { RedditUserModel } from 'src/core/business/models/reddit-user.model';
import { CommandBus } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { KohonenNetwork } from 'src/core/services/machine-learning-services/kohonen-network';

@Controller('reddit-users')
export class RedditUsersController {
    constructor(private readonly commandBus: CommandBus) { }

    @Post()
    async create(@Body('redditUserName') redditUserName: string) {

        const redditUserModel = new RedditUserModel();
        redditUserModel.name = redditUserName;
        from(this.commandBus.execute(
            new NewRedditUserCommand(redditUserModel),
        )).subscribe((newRedditUserData) => {
            from(this.commandBus.execute(
                new AddCommentsForFirstTimeRedditUserCommand(redditUserModel),
            ));
            from(this.commandBus.execute(
                new AddSubredditsForRedditUserCommand(redditUserModel)),
            );
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
    async kNetwoerk() {
        const network = new KohonenNetwork();
        network.buildFullTrainingSet();
    }
}
