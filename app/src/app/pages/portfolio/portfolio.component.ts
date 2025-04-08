// src/app/pages/portfolio/portfolio.component.ts
import { Component, OnInit } from '@angular/core';
// Import nhiều hơn từ RxJS: BehaviorSubject, combineLatest
import { Observable, map, catchError, of, tap, BehaviorSubject, combineLatest, startWith } from 'rxjs';
// Import interfaces
import { DataService, Project, ProjectCategory } from '../../services/data.service';

@Component({
    selector: 'app-portfolio',
    standalone: false,
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

    // Observables cho dữ liệu gốc
    projects$: Observable<Project[]> = of([]);
    categories$: Observable<ProjectCategory[]> = of([]);

    // BehaviorSubject để quản lý category đang được chọn filter
    // Bắt đầu với giá trị 'all'
    private selectedCategorySlug = new BehaviorSubject<string>('all');
    // Observable công khai cho category đang chọn
    selectedCategorySlug$: Observable<string> = this.selectedCategorySlug.asObservable();

    // Observable cho danh sách dự án đã được filter
    filteredProjects$: Observable<Project[]> = of([]);

    isLoading = true;
    errorMessage: string | null = null;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;
        console.log("PortfolioComponent ngOnInit: Fetching data...");

        const portfolioData$ = this.dataService.getPortfolioData();

        // Lấy danh sách dự án và danh mục gốc
        this.projects$ = portfolioData$.pipe(map(data => data?.projects || []));
        this.categories$ = portfolioData$.pipe(map(data => data?.projectCategories || []));

        // --- Logic Lọc Dự án ---
        // Sử dụng combineLatest để kết hợp danh sách dự án gốc và category đang chọn
        this.filteredProjects$ = combineLatest([
            this.projects$, // Nguồn: Danh sách tất cả dự án
            this.selectedCategorySlug$ // Nguồn: Category slug đang được chọn (thay đổi khi user click filter)
        ]).pipe(
            map(([projects, selectedSlug]) => { // Nhận giá trị từ cả hai nguồn
                console.log(`Filtering projects by slug: ${selectedSlug}`);
                if (selectedSlug === 'all' || !selectedSlug) {
                    return projects; // Nếu chọn 'All' hoặc không có slug, trả về tất cả
                }
                // Lọc danh sách dự án dựa trên category_slug
                return projects.filter(project => project.category_slug === selectedSlug);
            }),
            // Bắt lỗi nếu có lỗi xảy ra trong quá trình lấy projects$ hoặc combineLatest
            catchError(err => {
                console.error("PortfolioComponent Error filtering projects:", err);
                this.errorMessage = `Error filtering projects: ${err.message}`;
                return of([]); // Trả về mảng rỗng khi có lỗi lọc
            })
        );

        // Xử lý loading/error chung (tương tự các component khác)
        portfolioData$.subscribe({
            next: (data) => {
                console.log("PortfolioComponent ngOnInit: Data received successfully.");
                this.isLoading = false;
            },
            error: (err) => {
                console.error("PortfolioComponent ngOnInit: Error fetching data:", err);
                this.errorMessage = err.message || 'Failed to load Portfolio data.';
                this.isLoading = false;
            }
        });
    } // Kết thúc ngOnInit

    /**
     * Hàm được gọi khi người dùng click vào một nút filter category.
     * Cập nhật giá trị cho BehaviorSubject 'selectedCategorySlug'.
     * @param categorySlug Slug của category được chọn ('all' hoặc slug cụ thể).
     */
    selectCategory(categorySlug: string): void {
        console.log(`Category selected: ${categorySlug}`);
        this.selectedCategorySlug.next(categorySlug); // Phát ra giá trị slug mới
        // filteredProjects$ sẽ tự động cập nhật nhờ combineLatest
    }
} // Kết thúc class
