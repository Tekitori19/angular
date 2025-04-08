import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs'; // Import Observable và map operator
import { DataService, Profile } from '../../services/data.service'; // Import service và interface Profile
// Import thêm interface SocialLink nếu bạn đã định nghĩa

@Component({
    selector: 'app-sidebar', // Thẻ <app-sidebar>
    templateUrl: './sidebar.component.html',
    standalone: false,
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit { // Implement OnInit

    // Khai báo các Observable để chứa dữ liệu từ service
    profile$: Observable<Profile | null> = new Observable(); // Khởi tạo để tránh lỗi
    socialLinks$: Observable<any[]> = new Observable(); // Thay 'any' bằng SocialLink[]

    showContacts = false; // Biến trạng thái để ẩn/hiện contact details

    // Inject DataService vào constructor
    constructor(private dataService: DataService) { }

    // Hàm ngOnInit sẽ chạy một lần sau khi component được khởi tạo
    ngOnInit(): void {
        // Gọi service để lấy dữ liệu portfolio chung
        const portfolioData$ = this.dataService.getPortfolioData();

        // Trích xuất profile từ dữ liệu chung
        this.profile$ = portfolioData$.pipe(
            map(data => data?.profile || null) // Dùng map để lấy ra profile, trả về null nếu data không có
        );

        // Trích xuất social links
        this.socialLinks$ = portfolioData$.pipe(
            map(data => data?.socialLinks || []) // Lấy socialLinks, trả về mảng rỗng nếu không có
        );
    }

    // Hàm để bật/tắt hiển thị contact details
    toggleContacts(): void {
        this.showContacts = !this.showContacts;
        console.log('Show contacts:', this.showContacts); // Kiểm tra
    }
}
