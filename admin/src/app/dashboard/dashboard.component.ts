import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { CONFIG } from '../../../config';
import { Observable } from 'rxjs/Observable';
 import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Component({
    selector: 'dashboard',
    styleUrls: ['./dashboard.component.css'],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    search: any = {};
    size: number;
    number: number;
    pagetitle: string;
    edit: boolean;
    userdet: boolean;
    isloggedin: boolean;
    dobyear: any[];
    countries: any;
    usr: any = {}
    data: any;
    userlist: any;
    admintoken: any;
    constructor(private http: Http,
        private _appservice: UserService,
        private _message: MessageService,
    ) {
        this.search.name = ''
        this.search.email = ''
        this.search.dob = ''
        this.search.gender = ''
        this.search.country = ''
        this.search.macNutProf = ''
    }
    ngOnInit(): void {
        this.usr = {}
        var userarr = [], query
        this.size = 10
        this.number = 1
        this.admintoken = localStorage.getItem('admintoken');
        var obj = {
            size: this.size,
            number: this.number,
            name: this.search.name,
            email: this.search.email,
            macNutProf: this.search.macNutProf
        }
        // this._appservice.getAllPassenger(obj).subscribe((Response) => {
        //     console.log(Response)
        //     var result = Response.passengerList
        //     for (var index = 0; index < result.length; index++) {
        //         var userarrval = {}
        //         userarrval['photo_path'] = result[index].photo_path
        //         userarrval['first_name'] = result[index].first_name
        //         userarrval['email_address'] = result[index].email_address
        //         userarrval['mobile_no'] = result[index].mobile_no
        //         userarrval['facebook_image_url'] = result[index].facebook_image_url
        //         userarrval['passenger_id'] = result[index].passenger_id
        //         userarr.push(userarrval)
        //     }
        //     this.data = userarr
        // }, (Error) => {
        // })
    }
    getuser(str: any) {
        this.edit = true
        this.pagetitle = 'Edit Passenger'
        this.usr = str
    }
    updateUserData() {
        var flag = 0, errorMessage, re, isSplChar_name;
        re = /^([a-zA-Z ]+)$/;
        isSplChar_name = !re.test(this.usr.first_name);
        if (this.usr.first_name == '' || this.usr.first_name == undefined) {
            errorMessage = 'Please enter name';
            flag = 1;
            this._message.showError(errorMessage)
            console.log(errorMessage);
            return false;
        }
        if (this.usr.first_name.trim() == '') {
            errorMessage = 'Please enter name';
            flag = 1;
            this._message.showError(errorMessage)
            console.log(errorMessage);
            return false;
        }
        if (isSplChar_name == true) {
            errorMessage = 'Please enter characters only in name';
            flag = 1;
            this._message.showError(errorMessage)
            console.log(errorMessage)
            return false;
        }
        if (this.usr.email_address == '' || this.usr.email_address == undefined) {
            errorMessage = 'Please enter email';
            console.log(errorMessage);
            flag = 1;
            this._message.showError(errorMessage)
            return false;
        }
        /*if (this.usr.isBlocked == "" || this.usr.isBlocked == undefined) {
            errorMessage = 'Are you want to Blocked the user';
            flag = 1;
            this._message.showError(errorMessage)
            console.log(errorMessage)
            return false;
        }*/
        
    }
    adduser() {
        this.edit = false
        this.pagetitle = 'Add Passenger'
        this.usr = {}
        
    }
    loadmore() {
        
    }
    clear() {
      
        this.search.name = ''
        this.search.email = ''
        this.search.macNutProf = ''
        this.ngOnInit()
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers({ 'Accept': 'application/json' });
            /** No need to include Content-Type in Angular 4 */
            //   headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            var admintoken = localStorage.getItem('admintoken');
            var URL;
            if(this.edit==true){
                URL = CONFIG.API_ENDPOINT + 'uploadPhotoByAdmin';
            }else{
                URL = CONFIG.API_ENDPOINT + 'uploadPhotoByAdmin';
            }
            
            this.http.post(URL, formData, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
            .subscribe((Response) => { 	
                this.usr.photo_path = Response.photo_path
                this.usr.original_name = Response.original_name
            }, (Error) => {
                console.log(Error)
                
            })
        }
    }

    deleteUser(item) {
		console.log(item);

        if(confirm("Are you sure want to delete this passenger?")) {
            //this.isloader=true
            var obj = { id: item.passenger_id }
            
       }

    }

}
