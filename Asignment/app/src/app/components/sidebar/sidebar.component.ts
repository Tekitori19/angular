import { Component, OnInit } from '@angular/core'; // Import OnInit
import { Observable, map, catchError, of, tap } from 'rxjs'; // Import Observable, map, catchError, of
import { DataService, Profile, SocialLink } from '../../services/data.service'; // Import service và interfaces

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: false,
    styleUrls: ['./sidebar.component.css']
})
// Implement OnInit để sử dụng hook ngOnInit
export class SidebarComponent implements OnInit {
    profile$: Observable<Profile | null> = of(null);
    socialLinks$: Observable<SocialLink[]> = of([]);
    isLoading = true; // <<< Khởi tạo là true
    errorMessage: string | null = null;
    showContacts = false;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.isLoading = true; // Đặt lại isLoading mỗi khi init
        this.errorMessage = null;

        console.log("Sidebar ngOnInit: Fetching data..."); // Thêm log

        const portfolioData$ = this.dataService.getPortfolioData();

        // Profile
        this.profile$ = portfolioData$.pipe(
            map(data => data?.profile || null),
            // Di chuyển tap vào cuối hoặc xử lý loading/error chung
            catchError(err => {
                this.errorMessage = `Profile Error: ${err.message || 'Failed to load profile.'}`;
                // QUAN TRỌNG: Vẫn phải set isLoading = false khi lỗi ở đây nếu không xử lý chung
                // this.isLoading = false; // Nếu chỉ xử lý lỗi riêng cho profile
                console.error("Sidebar Error loading profile:", err);
                return of(null); // Trả về null khi lỗi
            })
        );

        // Social Links
        this.socialLinks$ = portfolioData$.pipe(
            map(data => data?.socialLinks || []),
            catchError(err => {
                console.error("Sidebar Error loading social links:", err);
                return of([]); // Trả về mảng rỗng khi lỗi
            })
        );

        // == CÁCH TỐT HƠN: Xử lý loading/error chung cho cả portfolioData$ ==
        portfolioData$.subscribe({
            next: (data) => {
                console.log("Sidebar ngOnInit: Data received successfully.");
                // Dữ liệu đã được map vào profile$ và socialLinks$ bởi các pipe ở trên
                this.isLoading = false; // <<< Chỉ đặt isLoading = false KHI THÀNH CÔNG
                this.errorMessage = null; // Xóa lỗi nếu thành công
            },
            error: (err) => {
                console.error("Sidebar ngOnInit: Error fetching portfolioData$:", err);
                this.errorMessage = `Sidebar Data Error: ${err.message || 'Failed to load sidebar data.'}`;
                this.isLoading = false; // <<< Đặt isLoading = false KHI LỖI
            }
            // complete: () => { // Ít khi cần dùng với HTTP GET đơn lẻ
            //    console.log("Sidebar ngOnInit: portfolioData$ completed.");
            // }
        });
    } // kết thúc ngOnInit

    toggleContacts(): void {
        this.showContacts = !this.showContacts;
    }
}
