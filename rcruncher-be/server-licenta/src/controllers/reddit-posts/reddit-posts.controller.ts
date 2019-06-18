import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddNewRedditPostCommand } from 'src/core/business/commands/command.exporter';
import { GetRedditPostWithAssociatedDataQuery } from 'src/core/business/queries/query.exporter';

@Controller('reddit-posts')
export class RedditPostsController {
    private text = 'Somehow no one here seems to have pointed out yet that Facebooks stab at world financial domination  the Libra blockchain - is implemented using Rust. Well I guess they couldnt use PHP and Java is out for being to big and garbage collecty(not to mention too Oracle), C and C++ are primitive and wide open to memory related bugs, Go is the invention of Google and still garbage collection based, and most other functional languages not based on JVM are not really known for high performance.Which leaves...Rust!'

constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

@Post('url')
async createPost(@Body('postURL') postURL: string) {
    this.commandBus.execute(
        new AddNewRedditPostCommand(postURL, this.text)
    );
}

@Get('post/:url')
async getPostWithData(@Param() params) {
    return this.queryBus.execute(
        new GetRedditPostWithAssociatedDataQuery(params.url),
    );
}
}
