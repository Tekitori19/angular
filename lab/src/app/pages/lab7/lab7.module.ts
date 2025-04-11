import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lab7Component } from './lab7.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', component: Lab7Component },
];


@NgModule({
    declarations: [
        Lab7Component
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class Lab7Module { }
