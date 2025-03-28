import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HeaderComponent } from './components/header/header.component';
import { TableContentComponent } from './components/table-content/table-content.component';
import { RouterModule } from '@angular/router';
import { ProductContainerComponent } from './product-container/product-container.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        AppComponent,
        ProductCardComponent,
        CarouselComponent,
        ProductDetailComponent,
        HeaderComponent,
        TableContentComponent,
        ProductContainerComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        RouterModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
