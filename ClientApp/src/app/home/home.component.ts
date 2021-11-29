import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../core/services/login.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('loginFormDirective') private loginFormDirective: NgForm;

    loginFormGroup: FormGroup;
    hidePassword: boolean;
    successfullyLoggedIn: boolean;
    askToValidateClient: boolean;

    constructor(private loginService: LoginService) {
    }

    ngOnInit() {
        this.initloginFormGroup();
        this.hidePassword = true;
    }

    validateClient(username: string, password: string) {
        this.loginService.validateClient(username, password).subscribe((response: boolean) => {
            this.askToValidateClient = true;
            this.successfullyLoggedIn = response;
            sessionStorage.setItem("successfullyLoggedIn", response.toString());
        });
    }

    private initloginFormGroup() {
        this.loginFormGroup = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });

        if (this.loginFormDirective)
            this.loginFormDirective.resetForm();
    }
}
