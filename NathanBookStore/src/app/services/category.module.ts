import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class CategoryService {
    
    constructor(private http: HttpClient) { }

    getCategory() {
        //option
        let options = {
            headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
        }
        //body
        let body = {}

        return this.http.post("http://localhost:3000/api/cate", options);
    }
}