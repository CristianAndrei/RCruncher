import { Test, TestingModule } from '@nestjs/testing';
import { RedditUsersController } from './reddit-users.controller';

describe('Users Controller', () => {
  let controller: RedditUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedditUsersController],
    }).compile();

    controller = module.get<RedditUsersController>(RedditUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
