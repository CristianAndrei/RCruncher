import { Injectable } from '@nestjs/common';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
import { Observable, from } from 'rxjs';
import SOM = require('ml-som');
import { UserSubredditEntity } from 'src/core/domain/entities/reddit-users/reddit.subreddits.entity';
import { getRepository } from 'typeorm';
import { KohonenOptions } from './kohonen.options';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
export class KohonenNetwork {
    private trainingSet;
    private internalNetwork: any;
    private kOptions = new KohonenOptions();
    private maxSubreddits: number;
    constructor() {
        this.createOptions().subscribe((options) => {
            this.internalNetwork = new SOM(this.kOptions.xValue, this.kOptions.yValue, options);
        });
    }
    public createOptions(): Observable<any> {
        const newPromise = new Promise(async (resolve) => {
            const allSubReddits = await getRepository(UserSubredditEntity).
                createQueryBuilder('subreddits').
                select('DISTINCT subreddits.origin', 'subject').getRawMany();

            const maximum = await getRepository(UserSubredditEntity).
                createQueryBuilder('subreddits').
                select('MAX(subreddits.numberOfAppearances)', 'maximum').getRawOne();

            const fields = [];

            for (const object of allSubReddits) {
                const property = {};
                property['name'] = object.subject;
                property['range'] = [0, maximum.maximum];
                fields.push(property);
            }
            this.kOptions.setFields(fields);
            const options = this.kOptions.createOptions();
            resolve(options);
        });
        return from(newPromise);
    }
    public buildFullTrainingSet(): Observable<any> {

        const newPromise = new Promise(async (resolve) => {
            const allSubbreddits = await UserSubredditEntity.find();
            const redditUsers = await RedditUserEntity.find({ relations: ['createdSubreddits'] });
            this.trainingSet = [];
            for (const currentUser of redditUsers) {
                this.buildUserTrainingSet(currentUser, allSubbreddits).subscribe((userData) => {
                    this.trainingSet.push(userData);
                });
            }
            resolve();
        });
        return from(newPromise);
    }
    public buildUserTrainingSet(currentUser: RedditUserEntity, allSubbreddits: UserSubredditEntity[]): Observable<any> {
        const newPromise = new Promise(async (resolve) => {
            const userDataSet = {};
            for (const subreddit of allSubbreddits) {
                const foundSubredditForUser = await UserSubredditEntity.findOne(
                    {
                        where: { origin: subreddit.origin, owner: currentUser },
                    },
                );
                if (foundSubredditForUser !== undefined) {
                    userDataSet[subreddit.origin] = subreddit.numberOfAppearances;
                } else {
                    userDataSet[subreddit.origin] = 0;
                }
            }
            resolve(userDataSet);
        });
        return from(newPromise);
    }

    public saveNetwork() { }
    public loadNetwork() { }
    public trainNetwork() {
        this.buildFullTrainingSet().subscribe(() => {
            console.log("started training");
            this.internalNetwork.train(this.trainingSet);
        });
    }
    public seeNetwork() {
        const fields = this.internalNetwork.export();
        console.log(fields.data);
    }
}