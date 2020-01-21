import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './components/pages/home/home.component';
import { CateComponent } from './components/pages/cate/cate.component';
import { DetailComponent } from './components/pages/detail/detail.component';

const routesConfig: Routes = [
    { path: 'cate', component: CateComponent },
    { path: 'detail', component: DetailComponent },
    { path: '**', component: HomeComponent }
]

@NgModule({
    declarations: [
        HomeComponent,
        CateComponent,
        DetailComponent
    ],
    imports: [
        RouterModule.forRoot(routesConfig),
        CommonModule
    ],
    exports: [RouterModule]
})

export class AppRoutingModule { }