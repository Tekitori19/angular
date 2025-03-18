import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductCardComponent } from './components/product-card/product-card.component';

const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'card', component: ProductCardComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
