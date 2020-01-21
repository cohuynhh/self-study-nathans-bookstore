import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.module'

@Component({
    templateUrl: 'categories.component.html',
    selector: 'categories',
    providers: [CategoryService]
})

export class CategoriesComponent {

    arrCate: any = [];

    constructor(private cateSrv: CategoryService) {
        cateSrv.getCategory().subscribe(data => {
            this.arrCate = data.items;
        });
    }
}