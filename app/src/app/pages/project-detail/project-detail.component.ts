// src/app/pages/project-detail/project-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, of, tap, catchError, Subject, takeUntil } from 'rxjs'; // Import Subject, takeUntil
import { DataService, Project } from '../../services/data.service';
import { Title } from '@angular/platform-browser'; // Import Title service

@Component({
    selector: 'app-project-detail',
    standalone: false,
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

    // Subject để quản lý việc hủy subscription khi component bị destroy
    private destroy$ = new Subject<void>();

    // Không cần dùng Observable trực tiếp trong template nếu không thích async pipe
    project: Project | null | undefined = undefined; // undefined: đang load, null: không tìm thấy/lỗi
    isLoading = true;
    errorMessage: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private router: Router,
        private titleService: Title // Inject Title service
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.project = undefined; // Reset project state

        this.route.paramMap.pipe(
            // Lấy slug từ params
            map(params => params.get('slug')),
            tap(slug => console.log(`ProjectDetail: Found slug in URL: ${slug}`)), // Log slug
            // switchMap để hủy request cũ nếu slug thay đổi nhanh
            switchMap(slug => {
                if (slug) {
                    // Gọi service
                    return this.dataService.getProjectBySlug(slug).pipe(
                        catchError(err => { // Bắt lỗi từ service
                            this.errorMessage = `Error loading project: ${err.message}`;
                            console.error("ProjectDetail Error from service:", err);
                            return of(null); // Trả về null khi service lỗi
                        })
                    );
                } else {
                    // Không có slug, trả về null
                    this.errorMessage = 'Project slug is missing in the URL.';
                    return of(null);
                }
            }),
            // Sử dụng takeUntil để tự động hủy subscription khi component destroy
            takeUntil(this.destroy$)
        ).subscribe(foundProject => {
            this.isLoading = false; // Kết thúc loading
            // Gán giá trị cho thuộc tính project
            this.project = foundProject; // Có thể là Project hoặc null (nếu lỗi hoặc không tìm thấy)

            if (this.project) {
                console.log("ProjectDetail: Project data loaded:", this.project);
                // Đặt tiêu đề trang
                this.titleService.setTitle(`${this.project.title} - Project Details`);
            } else {
                console.log("ProjectDetail: Project not found or error loading.");
                if (!this.errorMessage) { // Đặt lỗi nếu chưa có lỗi từ catchError
                    this.errorMessage = this.errorMessage || 'Project not found.';
                }
                this.titleService.setTitle('Project Not Found');
                // Optional: Tự động chuyển hướng về portfolio sau vài giây nếu không tìm thấy
                // setTimeout(() => this.router.navigate(['/portfolio']), 3000);
            }
        });
    } // End ngOnInit

    ngOnDestroy(): void {
        // Phát tín hiệu để hủy các subscription đang chạy
        this.destroy$.next();
        this.destroy$.complete();
        console.log("ProjectDetail: Component destroyed, subscriptions unsubscribed.");
    }

    /**
     * Định dạng chuỗi mô tả bằng cách thay thế dấu xuống dòng bằng thẻ <br>.
     * @param description Chuỗi mô tả gốc.
     * @returns Chuỗi HTML đã định dạng hoặc chuỗi rỗng.
     */
    formatDescription(description: string | null | undefined): string {
        if (!description) {
            return ''; // Trả về chuỗi rỗng nếu không có mô tả
        }
        // Sử dụng RegEx ở đây trong TypeScript là hoàn toàn hợp lệ
        return description.replace(/\n/g, '<br>');
    }

    // Hàm tiện ích để tách chuỗi technologies thành mảng
    getTechnologies(): string[] {
        if (this.project?.technologies_used) {
            return this.project.technologies_used.split(',').map(tech => tech.trim()).filter(tech => tech);
        }
        return [];
    }
} // End class
