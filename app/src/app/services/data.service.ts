import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // <<< Import HttpClient và HttpErrorResponse
import { Observable, throwError, BehaviorSubject, map, catchError, shareReplay, tap, filter } from 'rxjs'; // <<< Import các thành phần RxJS

// ========================================
// Định nghĩa Interfaces Dữ liệu
// ========================================

// Thông tin cá nhân cơ bản
export interface Profile {
    id?: number; // id có thể có hoặc không khi nhận về
    full_name: string;
    job_title?: string | null; // Cho phép null nếu DB trả về null
    avatar_image_url?: string | null;
    email: string;
    phone?: string | null;
    birthday?: string | null; // API trả về dạng string YYYY-MM-DD
    address?: string | null;
    about_text?: string | null;
    // map_embed_url đã bị xóa
}

// Liên kết mạng xã hội
export interface SocialLink {
    id?: number;
    platform: string;
    url: string;
    icon_name?: string | null; // Tên icon (vd: logo-facebook)
    display_order?: number;
}

// Dịch vụ cung cấp
export interface ServiceItem {
    id?: number;
    title: string;
    description: string;
    icon_image_url?: string | null;
    display_order?: number;
}

// Lời chứng thực
export interface Testimonial {
    id?: number;
    client_name: string;
    client_avatar_url?: string | null;
    quote: string;
    date?: string | null; // API trả về dạng string YYYY-MM-DD
    display_order?: number;
}

// Khách hàng (logo)
export interface Client {
    id?: number;
    name: string;
    logo_image_url: string;
    website_url?: string | null;
    display_order?: number;
}

// Học vấn
export interface Education {
    id?: number;
    institution_name: string;
    degree_or_focus?: string | null;
    period?: string | null; // Ví dụ: "2020 - 2024"
    description?: string | null;
    display_order?: number;
}

// Kinh nghiệm làm việc
export interface Experience {
    id?: number;
    job_title: string;
    company_name?: string | null;
    period?: string | null; // Ví dụ: "2023 - Present"
    description?: string | null;
    display_order?: number;
}

// Kỹ năng
export interface Skill {
    id?: number;
    name: string;
    percentage: number; // Số từ 0 đến 100
    category?: string | null; // Ví dụ: "Frontend", "Backend", "Tools"
    display_order?: number;
}

// Danh mục dự án
export interface ProjectCategory {
    id: number; // ID là bắt buộc
    name: string;
    slug: string; // slug là bắt buộc
}

// Dự án
export interface Project {
    id?: number;
    title: string;
    slug: string; // slug là bắt buộc cho URL
    category_id?: number | null;
    // Các trường này được JOIN từ backend API
    category_name?: string | null;
    category_slug?: string | null;
    thumbnail_image_url: string; // Ảnh thumbnail là bắt buộc
    description?: string | null;
    technologies_used?: string | null; // Có thể là chuỗi cách nhau bởi dấu phẩy
    project_url?: string | null; // Link live demo
    source_code_url?: string | null; // Link source code (Github)
    date_completed?: string | null; // API trả về dạng string YYYY-MM-DD
    is_featured?: number; // 0 hoặc 1
    display_order?: number;
}

// Chứng chỉ/Khóa học
export interface Certificate {
    id?: number;
    name: string;
    issuing_organization: string;
    issue_date: string; // API trả về dạng string YYYY-MM-DD
    expiration_date?: string | null; // API trả về dạng string YYYY-MM-DD
    credential_id?: string | null; // Mã chứng chỉ (nếu có)
    credential_url?: string | null; // Link xác thực online
    description?: string | null;
    image_url?: string | null; // Ảnh chứng chỉ (nếu có)
    display_order?: number;
}

// Interface tổng hợp cho dữ liệu trả về từ endpoint /api/portfolio-data
export interface PortfolioData {
    profile: Profile; // Profile là bắt buộc và chỉ có 1
    socialLinks: SocialLink[]; // Mảng các social links
    services: ServiceItem[]; // Mảng các services
    testimonials: Testimonial[]; // Mảng testimonials
    clients: Client[]; // Mảng clients
    education: Education[]; // Mảng education
    experience: Experience[]; // Mảng experience
    skills: Skill[]; // Mảng skills
    projectCategories: ProjectCategory[]; // Mảng danh mục dự án
    projects: Project[]; // Mảng dự án
    certificates: Certificate[]; // Mảng chứng chỉ
}

// Interface cho dữ liệu gửi đi của Contact Form
export interface ContactFormData {
    fullname: string;
    email: string;
    subject?: string | null; // Subject có thể có hoặc không
    message: string;
}

// Interface cho dữ liệu trả về sau khi gửi Contact Form thành công
export interface ContactResponse {
    success: boolean; // true nếu thành công
    message: string; // Thông báo từ backend
    id?: number; // ID của bản ghi contact submission đã lưu
}


// --- Bắt đầu phần Service ---
@Injectable({
    providedIn: 'root'
})
export class DataService {
    private apiUrl = 'http://localhost:3000/api';

    // Biến để lưu trữ cache của dữ liệu portfolio
    // Kiểu Observable<PortfolioData> | null nghĩa là nó có thể là Observable hoặc null
    private portfolioDataCache$: Observable<PortfolioData> | null = null;

    constructor(private http: HttpClient) { } // HttpClient đã được inject

    /**
     * Lấy toàn bộ dữ liệu portfolio từ API (có sử dụng cache).
     * @returns Observable chứa đối tượng PortfolioData.
     */
    getPortfolioData(): Observable<PortfolioData> {
        // Kiểm tra xem đã có cache chưa
        if (!this.portfolioDataCache$) {
            console.log('DataService: Cache miss! Fetching portfolio data from API...');
            // Nếu chưa có cache, thực hiện gọi API GET
            this.portfolioDataCache$ = this.http.get<PortfolioData>(`${this.apiUrl}/portfolio-data`)
                .pipe(
                    // Sử dụng 'tap' để thực hiện "side effect" như logging mà không thay đổi dữ liệu
                    tap(data => console.log('DataService: API response received.', data)),

                    // Sử dụng 'shareReplay(1)' để:
                    // 1. Chia sẻ kết quả của Observable này cho tất cả các subscriber.
                    // 2. Cache lại kết quả cuối cùng (số 1 nghĩa là cache 1 giá trị).
                    // Lần gọi getPortfolioData() tiếp theo sẽ nhận được giá trị cache này ngay lập tức.
                    shareReplay(1),

                    // Sử dụng 'catchError' để bắt lỗi HTTP và xử lý thông qua hàm handleError
                    catchError(this.handleError)
                );
        } else {
            console.log('DataService: Cache hit! Returning cached portfolio data...');
        }

        // Trả về Observable (hoặc là cái mới gọi API, hoặc là cái đã có trong cache)
        return this.portfolioDataCache$;
    }

    /**
          * Lấy thông tin chi tiết của một dự án dựa vào slug.
          * Sử dụng dữ liệu đã được cache từ getPortfolioData().
          * @param slug Slug của dự án cần lấy.
          * @returns Observable chứa đối tượng Project hoặc undefined nếu không tìm thấy.
          */
    getProjectBySlug(slug: string): Observable<Project | undefined> {
        return this.getPortfolioData().pipe( // Bắt đầu bằng cách gọi getPortfolioData() (sẽ dùng cache nếu có)
            map(data => { // Dùng 'map' để biến đổi dữ liệu PortfolioData
                console.log(`DataService: Searching for project with slug "${slug}" in cached data.`);
                // Tìm dự án trong mảng data.projects có slug khớp
                const foundProject = data.projects.find(project => project.slug === slug);
                console.log('DataService: Project found?', foundProject);
                return foundProject; // Trả về dự án tìm được hoặc undefined
            }),
            catchError(err => { // Vẫn bắt lỗiเผื่อ có lỗi từ getPortfolioData() gốc
                console.error(`DataService: Error finding project by slug "${slug}"`, err);
                // Trong trường hợp lỗi từ getPortfolioData, trả về observable lỗi
                // hoặc có thể trả về of(undefined) nếu muốn component xử lý trường hợp không tìm thấy/lỗi như nhau
                return throwError(() => new Error(`Không thể tìm thấy dự án với slug: ${slug}. Lỗi gốc: ${err.message}`));
            })
        );
    }

    /**
          * Lấy thông tin chi tiết của một chứng chỉ dựa vào ID.
          * Sử dụng dữ liệu đã được cache từ getPortfolioData().
          * @param id ID của chứng chỉ cần lấy.
          * @returns Observable chứa đối tượng Certificate hoặc undefined nếu không tìm thấy.
          */
    getCertificateById(id: number): Observable<Certificate | undefined> {
        return this.getPortfolioData().pipe( // Bắt đầu bằng getPortfolioData()
            map(data => { // Biến đổi PortfolioData
                console.log(`DataService: Searching for certificate with ID "${id}" in cached data.`);
                // Tìm chứng chỉ trong mảng data.certificates có id khớp
                const foundCertificate = data.certificates.find(certificate => certificate.id === id);
                console.log('DataService: Certificate found?', foundCertificate);
                return foundCertificate; // Trả về certificate tìm được hoặc undefined
            }),
            catchError(err => {
                console.error(`DataService: Error finding certificate by ID "${id}"`, err);
                return throwError(() => new Error(`Không thể tìm thấy chứng chỉ với ID: ${id}. Lỗi gốc: ${err.message}`));
            })
        );
    }

    /**
        * Gửi dữ liệu từ Contact Form đến backend API.
        * @param formData Đối tượng chứa dữ liệu form (khớp với ContactFormData interface).
        * @returns Observable chứa phản hồi từ backend (khớp với ContactResponse interface).
        */
    sendContactMessage(formData: ContactFormData): Observable<ContactResponse> {
        console.log('DataService: Sending contact form data:', formData);
        // Thực hiện yêu cầu POST đến endpoint /contact
        return this.http.post<ContactResponse>(`${this.apiUrl}/contact`, formData)
            .pipe(
                tap(response => console.log('DataService: Contact form API response:', response)),
                catchError(this.handleError) // Xử lý lỗi chung
            );
    }

    /**
     * Hàm xử lý lỗi HTTP cơ bản.
     * @param error Đối tượng lỗi HttpErrorResponse
     * @returns Observable throwError với thông báo lỗi thân thiện hơn.
     */
    private handleError(error: HttpErrorResponse): Observable<never> { // Return type Observable<never> for throwError
        let errorMessage = 'Lỗi không xác định!';
        if (error.error instanceof ErrorEvent) {
            // Lỗi phía client hoặc mạng.
            errorMessage = `Lỗi Client/Network: ${error.error.message}`;
        } else {
            // Backend trả về mã lỗi.
            errorMessage = `Server trả về mã ${error.status}: ${error.message}`;
            // Cố gắng lấy thêm thông tin lỗi từ body response của backend nếu có
            const backendError = error.error?.error || error.error?.message || JSON.stringify(error.error);
            if (backendError) {
                errorMessage += ` - Chi tiết: ${backendError}`;
            }
        }
        console.error('DataService Error:', errorMessage);
        console.error('Raw Error:', error); // Log lỗi gốc để debug
        // Trả về một observable lỗi với thông điệp thân thiện hơn cho người dùng hoặc component xử lý.
        // Hàm throwError của RxJS tạo ra một Observable mà ngay lập tức phát ra lỗi.
        return throwError(() => new Error(`Đã có lỗi xảy ra khi lấy dữ liệu. ${errorMessage}`));
    }

}
