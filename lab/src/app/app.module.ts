import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ProductFormComponent } from './product-form/product-form.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        AppComponent,
        ProductCardComponent,
        CarouselComponent,
        ProductDetailComponent,
        HeaderComponent,
        TableContentComponent,
        ProductContainerComponent,
        ProductFormComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
