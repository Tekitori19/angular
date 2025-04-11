import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HeaderComponent } from './components/header/header.component';
import { TableContentComponent } from './components/table-content/table-content.component';
import { CreateTodoComponent } from './pages/lab6/create-todo/create-todo.component';
import { Lab6Component } from './pages/lab6/lab6.component';
import { UserPostsComponent } from './pages/lab6/user-posts/user-posts.component';
import { UserTodosComponent } from './pages/lab6/user-todos/user-todos.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductContainerComponent } from './product-container/product-container.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
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
        ProductFormComponent,
        Lab6Component,
        UserPostsComponent,
        UserTodosComponent,
        CreateTodoComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    providers: [
        provideHttpClient()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
