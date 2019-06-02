import { Injectable } from '@nestjs/common';
import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
import { Observable, from } from 'rxjs';
import SOM = require('ml-som');
@Injectable()
export class KohonenNetwork {
    private trainingSet;
    private internalNetwork: any;
    constructor() {
        this.internalNetwork = new SOM(20, 20);
    }
    public async buildFullTrainingSet() {
        const redditUsers = await RedditUserEntity.find();
        for (const currentUser of redditUsers) {
            this.buildUserTrainingSet(currentUser).subscribe( (userData) => {
                this.trainingSet.push(userData);
            });
        }

    }
    public buildUserTrainingSet(currentUser: RedditUserEntity): Observable<any> {
        const myPromise = new Promise((resolve) => {
            const userDataSet = {};
            for (const subreddit of currentUser.creadetSubreddits) {
                userDataSet[subreddit.name] = subreddit.numberOfAppearances;
            }
            resolve(userDataSet);
        });
        return from(myPromise);
    }

    public saveNetwork() {}
    public loadNetwork() {}
    public trainNetwork() {
        this.internalNetwork.train(this.trainingSet);
    }
    public predictUser(currentUser: RedditUserEntity) {
        this.buildUserTrainingSet(currentUser).subscribe( (userData) => {
            console.log(this.internalNetwork.predict(userData));
        })
     }
}