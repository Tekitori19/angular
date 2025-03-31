import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
    title = 'porfolio';
    @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;
    @ViewChildren('page') pages!: QueryList<ElementRef>;

    ngAfterViewInit() {
        this.navigationLinks = this.navLinks.toArray();
        this.pagesElements = this.pages.toArray();

        this.navigationLinks.forEach((link, index) => {
            link.nativeElement.addEventListener('click', () => {
                this.showPage(link.nativeElement.innerHTML.toLowerCase());
            });
        });

        // Show the default page (e.g., "about") on initial load
        this.showPage('about');
    }

    navigationLinks: any[] = [];
    pagesElements: any[] = [];

    showPage(pageName: string) {
        this.pagesElements.forEach((page) => {
            if (page.nativeElement.dataset.page === pageName) {
                page.nativeElement.classList.add('active');
            } else {
                page.nativeElement.classList.remove('active');
            }
        });

        this.navigationLinks.forEach((link) => {
            if (link.nativeElement.innerHTML.toLowerCase() === pageName) {
                link.nativeElement.classList.add('active');
            } else {
                link.nativeElement.classList.remove('active');
            }
        });
    }
}

