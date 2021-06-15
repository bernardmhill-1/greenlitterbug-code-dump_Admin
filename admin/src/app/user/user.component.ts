import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userservice/user.service';
import { MessageService } from '../userservice/message.services';
import { AppComponent } from '../app.component';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CONFIG } from "../../../config";
import { HighlightPipe } from '../highlight.pipe';
import { ExportToCsv } from 'export-to-csv';


@Component({
    selector: 'user',
    styleUrls: ['./user.component.css'],
    templateUrl: './user.component.html',
})
// class Select
export class UserComponent implements OnInit {
    edit: boolean;
    data: any;
    admintoken: any;
    pagetitle: any;
    popupDiv: any;
    item: any = {};
    size: number;
    number: number;
    public loading = false;
    csv_data: any= [];

    constructor(private http: Http,
        private _appservice: UserService,
        private _message: MessageService,
        private _app: AppComponent
    ) { }

    ngOnInit(): void {
        this.data = '';
        this.size = 10;
        this.number = 1;
        var obj = {
            size: this.size,
            number: this.number
        }
        this.admintoken = localStorage.getItem('admintoken');
        this._appservice.getAllUser(obj).subscribe((Response) => {
            if (Response.STATUSCODE == 4002) {
                this._message.showError(Response.message);
                this._app.logoutAdmin();
            } else {
                if (Response.success) {
                    var result = Response.response;
                    this.data = result;
                } else {
                    if (Response.code == 4000) {
                        this._message.showError(Response.message);
                        this._app.logoutAdmin();
                    } else {
                        this._message.showWarning(Response.message);
                    }
                }
            }
        }, (Error) => {
        })

    }
    getDetails(str: any) {
        this.loading = true;
        this.edit = true;
        this.popupDiv = true;
        this.pagetitle = 'View Details';
        var data = {
            _id: str._id
        }
        this._appservice.getUserDetails(data).subscribe((Response) => {
            this.loading = false;
            if (Response.STATUSCODE == 4002) {
                this._message.showError(Response.message);
                this._app.logoutAdmin();
            } else {
                if (Response.success) {
                    var result = Response.response;
                    this.item = result;
                } else {
                    this._message.showWarning(Response.message);
                }
            }
        }, (Error) => {
        })

    }

    loadmore() {
        this.loading = true;
        this.number = this.number + 1
        this.admintoken = localStorage.getItem('admintoken');
        var obj = {
            size: this.size,
            number: this.number
        }
        this._appservice.getAllUser(obj).subscribe((Response) => {
            this.loading = false;
            if (Response.STATUSCODE == 4002) {
                this._message.showError(Response.message);
                this._app.logoutAdmin();
            } else {
                if (Response.success) {
                    var result = Response.response;
                    this.data = result;
                } else {
                    this._message.showWarning(Response.message);
                }
            }
        }, (Error) => {
        })
    }

    clear() {
        this.ngOnInit()
    }
    generateReport() {
        const options = { 
            fieldSeparator: ',',
            filename: "User Report",
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true, 
            showTitle: false,
            title: '',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: false,
            headers: ['Name', 'Email', 'Total Recycle', 'Total Reward', 'Redeem Reward'] //Won't work with useKeysAsHeaders present!
          };

        this._appservice.getUserReport().subscribe((Response) => {
            this.loading = false;
            if (Response.STATUSCODE == 4002) {
                this._message.showError(Response.message);
                this._app.logoutAdmin();
            } else {
                if (Response.success) {
                    var result = Response.response;
                    console.log(result);
                    
                    if(result.length > 0){
                        result.map((item) =>{
                            this.csv_data.push({
                                name: item.first_name + ' ' + item.last_name,
                                email: item.email,
                                RecycleProducts: item.RecycleProducts,
                                totalReward: item.totalReward,
                                redemReward: item.totalReward - item.remainReward
                            });
                        })
                        
                    } else {
                        this.csv_data.push({
                            name: "",
                            email: "",
                            RecycleProducts: "",
                            totalReward: "",
                            redemReward: ""
                        });
                    }



                    const csvExporter = new ExportToCsv(options);
         
                    csvExporter.generateCsv(this.csv_data);

                } else {
                    this._message.showWarning(Response.message);
                }
            }
        }, (Error) => {
        })  
         
        
        
    }
}
