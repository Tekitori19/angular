import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductContainerComponent } from './product-container/product-container.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { Lab6Component } from './pages/lab6/lab6.component';

const routes: Routes = [
    { path: '', component: ProductContainerComponent },
    { path: 'card', redirectTo: '', pathMatch: 'full' },
    { path: 'card/:id', component: ProductDetailComponent },
    { path: 'form', component: ProductFormComponent },
    { path: 'lab6', component: Lab6Component },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
