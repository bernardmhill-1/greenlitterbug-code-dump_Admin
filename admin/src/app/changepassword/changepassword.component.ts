
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Http } from "@angular/http";

export class UpdatePasswordData {
    password: string;
    repassword: string;
    useremail: string;
}

@Component({
    selector: 'changepassword',
    styleUrls: ['./changepassword.component.css'],
    templateUrl: './changepassword.component.html'
})
export class ChangepasswordComponent implements OnInit {

    admintoken: any;

    updatePasswordData: UpdatePasswordData;

    constructor(private http: Http,
        private _appservice: UserService,
        private _message: MessageService,
        private _app: AppComponent
    ) {
    }
    ngOnInit(): void {

        this.admintoken = localStorage.getItem('admintoken');

        this.updatePasswordData = {
            password: '',
            repassword: '',
            useremail: ''
        };
    }

    updatePassword() {
        var passwordVaild = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#!%-*_~^.$@])(?=.{6,})/;
        if (this.updatePasswordData.password == '') {
            var errorMessage = 'Please enter a password';
            this._message.showError(errorMessage);
        }
        else if (this.updatePasswordData.password.length < 6) {
            var errorMessage = 'Password must be minimum 6 characters';
            this._message.showError(errorMessage);
        } 
        else if(!passwordVaild.test(this.updatePasswordData.password) ){
            var errorMessage = 'Password must contain at least 1 capital letter,\n\n1 small letter, 1 number and 1 special character.\n\nFor special characters you can pick one of these #!%-*_~^.$@';
            this._message.showError(errorMessage);
        } else if (this.updatePasswordData.password != this.updatePasswordData.repassword) {
            var errorMessage = 'Both password must match';
            this._message.showError(errorMessage);
        }
        else {
            this.updatePasswordData.useremail=localStorage.getItem('adminemail');
            this._appservice.updatePassword(this.updatePasswordData)
                .subscribe((Response) => {
                    if (Response.STATUSCODE == 4002) {
                        this._message.showError(Response.message);
                        this._app.logoutAdmin();
                    } else {
                        if (Response.success) {
                            this._message.showSuccess(Response.message);
                        } else {
                            this._message.showWarning(Response.message);
                        }
                    }                    
                }, (Error) => {
                    this._message.showError(Error.message)
                })
        }

    }
}
