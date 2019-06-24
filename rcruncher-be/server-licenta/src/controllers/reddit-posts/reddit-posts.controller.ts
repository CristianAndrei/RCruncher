import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddNewRedditPostCommand } from 'src/core/business/commands/command.exporter';
import { GetRedditPostWithAssociatedDataQuery } from 'src/core/business/queries/query.exporter';
import { CrawlerService } from 'src/core/services/services.exporter';

@Controller('reddit-posts')
export class RedditPostsController {
    private defaultDepth = 1;
    constructor(private readonly commandBus: CommandBus,
                private readonly queryBus: QueryBus,
                private readonly crawlerService: CrawlerService,
    ) { }

    @Post('url')
    async createPost(@Body('postURL') postURL: string) {
       this.crawlerService.crawlLink(this.defaultDepth, postURL).subscribe((data) => {
        this.commandBus.execute(
            new AddNewRedditPostCommand(postURL, data[0], data[1]),
        );
    });
    }

    @Get('post')
    async getPostWithData(@Param() params) {
        return this.queryBus.execute(
            new GetRedditPostWithAssociatedDataQuery(params.url),
        );
    }
}
