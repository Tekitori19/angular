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
    { path: 'lab7', loadChildren: () => import('./pages/lab7/lab7.module').then(m => m.Lab7Module) },
    { path: 'lab7/home', loadChildren: () => import('./pages/lab7/home/home.module').then(m => m.HomeModule) },
    { path: 'lab7/products', loadChildren: () => import('./pages/lab7/products/products.module').then(m => m.ProductsModule) },
    { path: 'lab7/user', loadChildren: () => import('./pages/lab7/user/user.module').then(m => m.UserModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
