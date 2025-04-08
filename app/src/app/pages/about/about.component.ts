import { Component, OnInit, Renderer2 } from '@angular/core'; // Import Renderer2
import { Observable, map, catchError, of, tap } from 'rxjs';
// Import interfaces cần thiết
import { DataService, Profile, ServiceItem, Testimonial, Client } from '../../services/data.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    standalone: false,
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    // Observables cho các phần dữ liệu
    // Khởi tạo với giá trị mặc định để tránh lỗi template ban đầu
    profile$: Observable<Profile | null> = of(null);
    services$: Observable<ServiceItem[]> = of([]);
    testimonials$: Observable<Testimonial[]> = of([]);
    clients$: Observable<Client[]> = of([]);
    // Observable chứa mảng các đoạn văn đã xử lý
    aboutParagraphs$: Observable<string[]> = of([]);

    isLoading = true; // Cờ báo loading chung cho cả trang About
    errorMessage: string | null = null; // Thông báo lỗi chung

    // Biến cho Testimonial Modal
    selectedTestimonial: Testimonial | null = null;
    isModalActive = false;

    // Inject DataService và Renderer2
    // Renderer2 dùng để thao tác an toàn với DOM (vd: thêm/xóa class trên body)
    constructor(
        private dataService: DataService,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;

        const portfolioData$ = this.dataService.getPortfolioData();

        // Sử dụng portfolioData$ cho tất cả các phần
        // Nếu getPortfolioData lỗi, tất cả các pipe dưới đây sẽ nhận lỗi

        this.profile$ = portfolioData$.pipe(map(data => data?.profile || null));
        this.services$ = portfolioData$.pipe(map(data => data?.services || []));
        this.testimonials$ = portfolioData$.pipe(map(data => data?.testimonials || []));
        this.clients$ = portfolioData$.pipe(map(data => data?.clients || []));
        this.aboutParagraphs$ = this.profile$.pipe(
            map(profile => {
                // 1. Lấy text, hoặc chuỗi rỗng nếu là null/undefined
                const text = profile?.about_text || '';
                if (!text) {
                    return []; // Trả về mảng rỗng nếu không có text
                }
                // 2. Tách chuỗi thành mảng dựa trên 1 hoặc nhiều dấu xuống dòng
                //    Regex /\n\s*\n/ tìm các dấu xuống dòng kép, có thể có khoảng trắng ở giữa
                //    Hoặc đơn giản hơn là tách bằng dấu xuống dòng kép '\n\n' nếu định dạng luôn cố định
                // 3. Trim khoảng trắng thừa ở đầu/cuối mỗi đoạn
                // 4. Lọc ra các đoạn rỗng sau khi trim
                return text.split(/\n\s*\n/) // Tách bằng dòng trống (linh hoạt hơn)
                    // Hoặc: text.split('\n\n') // Nếu luôn là xuống dòng kép
                    .map(paragraph => paragraph.trim()) // Loại bỏ khoảng trắng thừa
                    .filter(paragraph => paragraph.length > 0); // Giữ lại đoạn có nội dung
            }),
            catchError(err => { // Xử lý nếu có lỗi trong quá trình map
                console.error("AboutComponent: Error processing about text:", err);
                return of([]); // Trả về mảng rỗng khi có lỗi
            })
        );

        // Xử lý trạng thái loading và error chung sau khi getPortfolioData() hoàn tất hoặc lỗi
        portfolioData$.pipe(
            tap(() => this.isLoading = false), // Dừng loading khi có dữ liệu (hoặc khi lỗi đã bị bắt bởi service)
            catchError(err => {
                this.errorMessage = err.message || 'Failed to load page data.';
                this.isLoading = false; // Dừng loading khi có lỗi
                console.error("About Page Error:", err);
                // Không cần trả về gì ở đây vì các observable con đã được gán giá trị mặc định (of(null), of([]))
                // Nếu muốn các observable con cũng phát ra lỗi thì không return of(null) trong service
                return of(null); // Trả về dummy observable để catchError hoạt động
            })
        ).subscribe(); // Cần subscribe() để kích hoạt pipe này nếu không dùng async pipe trực tiếp
    }

    // --- Logic cho Testimonial Modal ---
    openTestimonialModal(testimonial: Testimonial): void {
        this.selectedTestimonial = testimonial;
        this.isModalActive = true;
        // Thêm class 'modal-active' vào thẻ body một cách an toàn
        this.renderer.addClass(document.body, 'modal-active');
    }

    closeTestimonialModal(): void {
        this.isModalActive = false;
        this.selectedTestimonial = null; // Reset lại testimonial đã chọn
        // Xóa class 'modal-active' khỏi thẻ body
        this.renderer.removeClass(document.body, 'modal-active');
    }
}
