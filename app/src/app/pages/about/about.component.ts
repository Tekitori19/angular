// src/app/pages/about/about.component.ts
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { DataService, Profile, ServiceItem, Testimonial, Client } from '../../services/data.service'; // Đảm bảo import đủ Interfaces

@Component({
    selector: 'app-about',
    standalone: false,
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    // Observables cho các phần dữ liệu
    profile$: Observable<Profile | null> = of(null);
    services$: Observable<ServiceItem[]> = of([]);
    testimonials$: Observable<Testimonial[]> = of([]);
    clients$: Observable<Client[]> = of([]);

    // <<< Observable MỚI để chứa các đoạn văn about_text đã xử lý >>>
    aboutParagraphs$: Observable<string[]> = of([]);

    isLoading = true;
    errorMessage: string | null = null;

    // Biến cho Testimonial Modal
    selectedTestimonial: Testimonial | null = null; // <<< Đảm bảo kiểu dữ liệu đúng
    isModalActive = false;

    constructor(
        private dataService: DataService,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;
        console.log("AboutComponent ngOnInit: Fetching data..."); // Log bắt đầu

        const portfolioData$ = this.dataService.getPortfolioData();

        // Gán các observable con
        this.profile$ = portfolioData$.pipe(map(data => data?.profile || null));
        this.services$ = portfolioData$.pipe(map(data => data?.services || []));
        this.testimonials$ = portfolioData$.pipe(map(data => data?.testimonials || []));
        this.clients$ = portfolioData$.pipe(map(data => data?.clients || []));

        // <<< Xử lý about_text thành các đoạn văn >>>
        this.aboutParagraphs$ = this.profile$.pipe( // Dùng profile$ đã map ở trên
            map(profile => {
                const text = profile?.about_text || '';
                if (!text) return []; // Mảng rỗng nếu không có text
                return text.split(/\n\s*\n/) // Tách bằng dòng trống
                    .map(p => p.trim())
                    .filter(p => p.length > 0);
            }),
            catchError(err => { // Bắt lỗi nếu quá trình map này lỗi
                console.error("AboutComponent Error processing about text:", err);
                return of([]); // Trả về mảng rỗng khi lỗi
            })
        );

        // Xử lý loading/error chung
        portfolioData$.subscribe({
            next: (data) => {
                console.log("AboutComponent ngOnInit: Data received successfully.");
                this.isLoading = false; // Dừng loading
                this.errorMessage = null;
            },
            error: (err) => {
                console.error("AboutComponent ngOnInit: Error fetching data:", err);
                this.errorMessage = err.message || 'Failed to load About page data.';
                this.isLoading = false; // Dừng loading khi lỗi
            }
        });
    }

    // Hàm mở modal
    openTestimonialModal(testimonial: Testimonial): void { // <<< Đảm bảo kiểu dữ liệu đúng
        console.log("Opening modal for:", testimonial.client_name); // Log
        this.selectedTestimonial = testimonial;
        this.isModalActive = true;
        this.renderer.addClass(document.body, 'modal-active');
    }

    // Hàm đóng modal
    closeTestimonialModal(): void {
        console.log("Closing modal"); // Log
        this.isModalActive = false;
        this.selectedTestimonial = null;
        this.renderer.removeClass(document.body, 'modal-active');
    }
}
