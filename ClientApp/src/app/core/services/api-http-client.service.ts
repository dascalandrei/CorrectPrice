import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class ApiHttpClient {
    constructor(private httpClient: HttpClient) {
    }

    get<T>(relativeUrl: string): Observable<T> {
        return this.httpClient.get<T>(this.getBaseUrl() + relativeUrl)
    }

    post<T>(relativeUrl: string, body: object): Observable<T> {
        console.log('-----------------------');
        console.log(this.getBaseUrl());
        console.log(relativeUrl);
        return this.httpClient.post<T>(this.getBaseUrl() + relativeUrl, body);
    }

    private getBaseUrl(): string {
        //return document.getElementsByTagName('base')[0].href;
        return 'http://localhost/';
    }
}
