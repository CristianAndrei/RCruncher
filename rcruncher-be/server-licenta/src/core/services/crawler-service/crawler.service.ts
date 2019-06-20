import { Injectable } from '@nestjs/common';
import * as Crawler from 'js-crawler';
import { PageContentRequester } from './page-requester.service';;
import { Observable, from } from 'rxjs';
@Injectable()
export class CrawlerService {
    private crawler: Crawler;
    private readonly baseLink: string = 'https://old.reddit.com/';

    constructor(private readonly contentRequester: PageContentRequester) { }

    private initCrawler(crawlDepth: number, links: string[]) {
        this.crawler = new Crawler().configure({
            depth: crawlDepth,
            maxRequestsPerSecond: 2,
            shouldCrawl: (url): boolean => {
                for (const subreddit of links) {
                    if (url.indexOf(subreddit) > -1) {
                        return true;
                    }
                }
                return false;
            },
        });
    }

    public crawlLinks(depth: number, links: string[]): void {
        this.initCrawler(depth, links);
        for (const link of links) {
            this.crawl(link);
        }
    }

    public crawlLink(depth: number, link: string): Observable<any> {
        this.initCrawler(depth, [link]);
        return this.crawl(link);
    }

    private crawl(url: string): Observable<any> {
        const newPromise = new Promise((resolve) => {

            url = url;
            this.crawler.crawl({
                url,
                success: (page) => {
                    if (page.url.indexOf('comments') > 0) {
                        console.log('crawl... ' + page.url);
                        this.contentRequester.handleRequest(page.url).subscribe((data) => {
                            if (this.checkJSON(data.text)) {

                                const object = JSON.parse(data.text);

                                if (object.length > 0) {
                                    if ('data' in (object[0])) {
                                        if (object[0].data.children.length > 0) {
                                            if ('data' in object[0].data.children[0]) {
                                                if ('selftext' in (object[0].data.children[0].data)) {
                                                    resolve([object[0].data.children[0].data.title,
                                                        object[0].data.children[0].data.selftext]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                },
            });
        });
        return from(newPromise);
    }
    private checkJSON(object): boolean {
        try {
            JSON.parse(object);
        } catch (e) {
            return false;
        }
        return true;
    }
}
