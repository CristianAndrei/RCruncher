import { Injectable } from '@nestjs/common';
import { get } from 'superagent';
import { Observable, from } from 'rxjs';

@Injectable()
export class PageContentRequester {
    constructor() { }

    public handleRequest(url: string): Observable<any> {
        return from(get(url + '.json'));
    }
}