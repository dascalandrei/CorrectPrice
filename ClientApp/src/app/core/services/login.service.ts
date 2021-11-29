import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "./api-http-client.service";

@Injectable()
export class LoginService {
    constructor(private httpClient: ApiHttpClient) {
    }

    validateClient(username: string, password: string): Observable<boolean> {
        const formData: FormData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        return this.httpClient.post<boolean>('Login/ValidateClient', formData)
    }
}
