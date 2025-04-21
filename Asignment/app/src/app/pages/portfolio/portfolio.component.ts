// src/app/pages/portfolio/portfolio.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of, BehaviorSubject, combineLatest, startWith, tap } from 'rxjs'; // Đảm bảo import đủ
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

    // BehaviorSubject quản lý slug của category đang được filter
    private selectedCategorySlug = new BehaviorSubject<string>('all');
    // Observable công khai cho category slug đang được filter (dùng trong template để highlight)
    selectedCategorySlug$: Observable<string> = this.selectedCategorySlug.asObservable();

    // Observable chứa danh sách projects đã được filter
    filteredProjects$: Observable<Project[]> = of([]);

    isLoading = true; // Cờ cho trạng thái loading ban đầu
    errorMessage: string | null = null; // Lưu trữ thông báo lỗi

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;
        // console.log("Portfolio ngOnInit: Initializing."); // Có thể giữ lại log này nếu muốn

        const portfolioData$ = this.dataService.getPortfolioData();

        // Lấy danh sách projects và categories gốc từ service
        this.projects$ = portfolioData$.pipe(
            map(data => data?.projects || []),
            tap(projects => console.log("Portfolio ngOnInit: Mapped projects$ >>>", projects)), // <<< XEM KỸ LOG NÀY
            catchError(err => { // Thêm catchError riêng cho projects$ nếu cần debug kỹ hơn
                console.error("Error mapping projects:", err);
                return of([]);
            })
        );
        this.categories$ = portfolioData$.pipe(
            map(data => data?.projectCategories || []),
            tap(categories => console.log("Portfolio ngOnInit: Mapped categories$ >>>", categories)), // <<< KIỂM TRA LOG NÀY
            catchError(err => {
                console.error("Error mapping categories:", err);
                return of([]);
            })
        );

        this.filteredProjects$ = combineLatest([
            this.projects$, // <<< Phải chắc chắn có dữ liệu từ Bước 1
            this.selectedCategorySlug$.pipe(startWith('all'))
        ]).pipe(
            tap(([projects, slug]) => console.log(`Portfolio Filter INPUT: Projects Count = ${projects?.length}, Slug = '${slug}'`)), // <<< LOG ĐẦU VÀO
            map(([projects, selectedSlug]) => {
                if (selectedSlug === 'all' || !selectedSlug) {
                    console.log("Portfolio Filter: Returning ALL projects."); // LOG trường hợp ALL
                    return projects;
                }
                // BỎ COMMENT LOG NÀY để xem các slug thực tế đang được so sánh
                // console.log("Projects for filtering:", projects.map(p => ({ title: p.title, category_slug: p.category_slug })));
                // console.log(`Filtering for slug: '${selectedSlug}'`);

                const filtered = projects.filter(project => {
                    // So sánh cẩn thận, có thể thêm .trim() hoặc toLowerCase() nếu cần
                    const projectSlug = project.category_slug?.trim().toLowerCase();
                    const filterSlug = selectedSlug.trim().toLowerCase();
                    // console.log(`Comparing: '${projectSlug}' === '${filterSlug}' for project '${project.title}'`);
                    return projectSlug === filterSlug;
                });

                console.log(`Portfolio Filter OUTPUT: Found ${filtered?.length} projects.`); // <<< LOG KẾT QUẢ LỌC
                return filtered;
            }),
            catchError(err => {
                console.error("PortfolioComponent Error filtering projects:", err);
                this.errorMessage = `Error filtering projects: ${err.message}`;
                return of([]);
            })
        );

        // Log giá trị cuối cùng mà filteredProjects$ phát ra
        this.filteredProjects$.subscribe(finalFiltered => console.log("Portfolio FINAL filteredProjects$ value:", finalFiltered)); // <<< LOG KẾT QUẢ CUỐI

        // Xử lý trạng thái loading/error chung khi dữ liệu portfolio gốc được resolve
        portfolioData$.subscribe({
            next: () => {
                // console.log("Portfolio ngOnInit: portfolioData$ resolved."); // Log nếu cần
                this.isLoading = false; // Dừng loading khi thành công
            },
            error: (err) => {
                console.error("PortfolioComponent ngOnInit: portfolioData$ error:", err);
                this.errorMessage = `Failed to load portfolio data: ${err.message}`;
                this.isLoading = false; // Dừng loading khi có lỗi
            }
        });
    } // Kết thúc ngOnInit

    /**
     * Cập nhật slug của category cần filter.
     * @param categorySlug Slug của category ('all' hoặc slug cụ thể).
     */
    selectCategory(categorySlug: string): void {
        this.selectedCategorySlug.next(categorySlug); // Phát giá trị mới cho BehaviorSubject
        // `filteredProjects$` sẽ tự động cập nhật
    }
}
