import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductContainerComponent } from './product-container/product-container.component';

const routes: Routes = [
    { path: '', component: ProductContainerComponent },
    { path: 'card', redirectTo: '', pathMatch: 'full' },
    { path: 'card/:id', component: ProductDetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
