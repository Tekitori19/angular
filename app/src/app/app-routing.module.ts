import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// <<< Import các Page components >>>
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { CertificateDetailComponent } from './pages/certificate-detail/certificate-detail.component';
// Chúng ta sẽ import ProjectDetailComponent và CertificateDetailComponent sau

const routes: Routes = [
    // Route cho trang 'About'
    {
        path: 'about', // Đường dẫn URL: /about
        component: AboutComponent, // Component hiển thị
        title: 'About Me - Portfolio' // Tiêu đề trang (hiển thị trên tab trình duyệt)
    },
    // Route cho trang 'Resume'
    {
        path: 'resume',
        component: ResumeComponent,
        title: 'Resume - Portfolio'
    },
    // Route cho trang 'Portfolio'
    {
        path: 'portfolio',
        component: PortfolioComponent,
        title: 'Portfolio - Portfolio'
    },
    // Route cho trang 'Contact'
    {
        path: 'contact',
        component: ContactComponent,
        title: 'Contact Me - Portfolio'
    },

    // Route mặc định: Khi người dùng truy cập vào gốc (ví dụ: http://localhost:4200/)
    // Sẽ tự động chuyển hướng đến trang '/about'.
    {
        path: '', // Đường dẫn gốc (rỗng)
        redirectTo: '/about', // Chuyển hướng đến path '/about'
        pathMatch: 'full' // Chỉ thực hiện redirect khi path là rỗng hoàn toàn
    },
    {
        path: 'projects/:slug', // <<< Đã có
        component: ProjectDetailComponent,
        title: 'Project Details'
    },
    {
        path: 'certificates/:id', // <<< Đã có
        component: CertificateDetailComponent,
        title: 'Certificate Details'
    },
    // Route Wildcard (cho các URL không hợp lệ)
    // Chuyển hướng tất cả các URL không khớp về trang '/about'.
    {
        path: '**', // Dấu ** khớp với bất kỳ chuỗi ký tự nào
        redirectTo: '/about'
        // Hoặc có thể tạo một component NotFoundComponent và trỏ tới nó:
        // component: NotFoundComponent, title: 'Page Not Found'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // Tùy chọn hữu ích: tự động cuộn lên đầu trang khi chuyển route
        scrollPositionRestoration: 'enabled',
        // Tùy chọn khác (ví dụ: anchor scrolling cho fragment #)
        // anchorScrolling: 'enabled',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
