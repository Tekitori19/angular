import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        ProductCardComponent,
        CarouselComponent,
        ProductDetailComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
