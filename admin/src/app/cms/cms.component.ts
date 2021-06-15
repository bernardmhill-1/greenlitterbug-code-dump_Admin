import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CONFIG } from "../../../config";
import { HighlightPipe } from '../highlight.pipe';

@Component({
    selector: 'cms',
    styleUrls: ['./cms.component.css'],
    templateUrl: './cms.component.html',
})
// class Select
export class CmsComponent implements OnInit {
    search: any = {};
    size: number;
    number: number;
    pagetitle: string;
    edit: boolean;
    userdet: boolean;
    isloggedin: boolean;
    dobyear: any[];
    cms: any = {}
    data: any;
    userlist: any;
    admintoken: any;
    category: any;
    public loading = false;
    constructor(private http: Http,
        private _appservice: UserService,
        private _message: MessageService,
        private _app: AppComponent
    ) {}

    ngOnInit(): void {
        this.cms = {}
        var dataarr = []
        this.size = 10
        this.number = 0
        this.admintoken = localStorage.getItem('admintoken');
        var obj = {
            size: this.size,
            number: this.number
           
        }
        this._appservice.getAllContent(obj).subscribe((Response) => {
            var result = Response.response;
            if (Response.STATUSCODE == 4002) {
                this._message.showError(Response.message);
                this._app.logoutAdmin();
            } else {
                if (Response.success) {
                    for (var index = 0; index < result.length; index++) {
                        var cmsarrval = {}
                        cmsarrval['_id'] = result[index]._id
                        cmsarrval['keyword'] = result[index].title
                        cmsarrval['description'] = result[index].description
                        dataarr.push(cmsarrval)
                    }
                    this.data = dataarr
                } else {
                    this._message.showWarning(Response.message);
                }
            }
        }, (Error) => {
        })
		
    }
    getcmspage(str: any) {
        this.edit = true;
        this.pagetitle = 'Edit '+str.keyword+' page';
        this.cms = str;
       // this.showModal = true;
    }
    updateCmsData() {
        var flag = 0, errorMessage, re, isSplChar_name, isSplChar_lname;
        re = /^([a-zA-Z ]+)$/;
        isSplChar_name = !re.test(this.cms.description);
        if (this.cms.description == '' || this.cms.description == undefined) {
            errorMessage = 'Please enter description';
            console.log(errorMessage);
            flag = 1;
            this._message.showError(errorMessage)
            return false;
        }    		
        if (this.edit == true && flag == 0) {
            this.loading = true;
            this._appservice.editContent(this.cms)
                .subscribe((Response) => {
                    this.loading = false;
                    if (Response.success) {
                        this._message.showSuccess(Response.message);
                    } else {
                        this._message.showError(Response.message);
                        this._app.logoutAdmin();
                    }
                }, (Error) => {
                    this._message.showError(Error.message)
                })
        }
    }    
    clear() {
        this.ngOnInit()
    }
}
