import { Test, TestingModule } from '@nestjs/testing';
import { RedditPostsController } from './reddit-posts.controller';

describe('RedditPosts Controller', () => {
  let controller: RedditPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedditPostsController],
    }).compile();

    controller = module.get<RedditPostsController>(RedditPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
