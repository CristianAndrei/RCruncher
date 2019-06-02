import { CreateKnnClustersCommand } from './create-knn-clusters.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateKnnClustersCommand)
export class CreateKnnClustersHandler implements ICommandHandler<CreateKnnClustersCommand> {
    constructor() { }

    async execute(command: CreateKnnClustersCommand) {

    }
}
