import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AboutComponent } from './pages/about/about.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CommonModule } from '@angular/common';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        AboutComponent,
        ResumeComponent,
        PortfolioComponent,
        ContactComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
    ],
    providers: [
        provideHttpClient()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
