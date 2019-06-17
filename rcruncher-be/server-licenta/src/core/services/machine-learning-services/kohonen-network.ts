import { RedditUserEntity } from 'src/core/domain/entities/entities.exporter';
import { Observable, from } from 'rxjs';
import SOM = require('ml-som');
import { UserSubredditEntity } from 'src/core/domain/entities/reddit-users/reddit.subreddits.entity';
import { getRepository } from 'typeorm';
import { KohonenOptions } from './kohonen.options';
const czekanowskiDistance = require('ml-distance').distance.czekanowski;
const fs = require('fs');
export class KohonenNetwork {

    private filePath = './tmp/savedKohonen.model.json';
    private trainingSet;
    private internalNetwork: any;
    private kOptions = new KohonenOptions();
    private baseFields = [];
    create() {
        this.createOptions().subscribe((options) => {
            this.internalNetwork = new SOM(this.kOptions.xValue, this.kOptions.yValue, options);
        });
    }
    public createOptions(): Observable<any> {
        const newPromise = new Promise(async (resolve) => {
            const allSubReddits = await getRepository(UserSubredditEntity).
                createQueryBuilder('subreddits').
                select('DISTINCT subreddits.origin', 'subject').getRawMany();

            const fields = [];

            for (const object of allSubReddits) {

                const maximum = await getRepository(UserSubredditEntity).
                    createQueryBuilder('subreddits').
                    select('MAX(subreddits.numberOfAppearances)', 'maximum')
                    .where('subreddits.origin =:origin', { origin: object.subject })
                    .getRawOne();

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
            for (const subreddit of allSubbreddits) {
                if (!(subreddit.origin in this.baseFields)) {
                    this.baseFields.push(subreddit.origin);
                }
            }
            for (const currentUser of redditUsers) {
                this.buildUserTrainingSet(currentUser, allSubbreddits).subscribe(async (userData) => {
                    this.trainingSet.push(userData);
                    currentUser.partOfTrainingSet = true;
                    await currentUser.save();
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
                if (this.baseFields.includes(subreddit.origin)) {
                    if (foundSubredditForUser !== undefined) {
                        userDataSet[subreddit.origin] = subreddit.numberOfAppearances;
                    } else {
                        userDataSet[subreddit.origin] = 0;
                    }
                }

            }
            resolve(userDataSet);
        });
        return from(newPromise);
    }

    public predictTrainedUsers(): Observable<any> {
        const newPromise = new Promise(async (resolve) => {
            const redditUsers = await RedditUserEntity.find({ where: { partOfTrainingSet: true }, relations: ['createdSubreddits'] });
            for (const redditUser of redditUsers) {
                this.predictUser(redditUser.name).subscribe((resultedData) => {
                    if (resultedData.length === 3 && resultedData[2].length === 2) {
                        redditUser.xPosition = resultedData[0];
                        redditUser.yPosition = resultedData[1];
                        redditUser.xDiference = resultedData[2][0];
                        redditUser.yDiference = resultedData[2][1];
                        redditUser.save();
                    }
                });
            }
            resolve();
        });
        return from(newPromise);
    }
    public saveNetwork() {
        fs.closeSync(fs.openSync(this.filePath, 'w'));
        fs.writeFile(this.filePath, JSON.stringify(this.internalNetwork.export()), (err) => {
            if (err) { console.log(err); }
        });
    }
    public loadNetwork() {
        fs.readFile(this.filePath, (err, buf) => {
            this.internalNetwork = SOM.load(JSON.parse(buf), czekanowskiDistance);
        });
    }
    public predictUser(userName: string): Observable<any> {
        const newPromise = new Promise(async (resolve) => {
            const allSubbreddits = await UserSubredditEntity.find();
            const redditUser = await RedditUserEntity.findOne({ where: { name: userName }, relations: ['createdSubreddits'] });
            this.buildUserTrainingSet(redditUser, allSubbreddits).subscribe((predictionSet) => {
                resolve(this.internalNetwork.predict(predictionSet, true));
            });
        });
        return from(newPromise);
    }

    public trainNetwork() {
        this.buildFullTrainingSet().subscribe(() => {
            this.internalNetwork.train(this.trainingSet);
        });
    }
    public seeNetwork() {
        return this.internalNetwork.getConvertedNodes();
    }
}