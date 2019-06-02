import { Controller, Post, Body } from '@nestjs/common';
import {
    NewRedditUserCommand, AddCommentsForFirstTimeRedditUserCommand, RenderTopicsForRedditUserCommand, AddSubredditsForRedditUserCommand,
} from 'src/core/business/commands/command.exporter';
import { RedditUserModel } from 'src/core/business/models/reddit-user.model';
import { CommandBus } from '@nestjs/cqrs';
import { from } from 'rxjs';

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
    @Post('createClustering')
    async createUserClusteringClustering() { }
    @Post('subreddits')
    async createSubreddits(@Body('redditUserName') redditUserName: string) {
        const redditUserModel = new RedditUserModel();
        redditUserModel.name = redditUserName;
        from(this.commandBus.execute(
            new AddSubredditsForRedditUserCommand(redditUserModel))
            ).subscribe( () => {console.log("okay")});
    }
}
