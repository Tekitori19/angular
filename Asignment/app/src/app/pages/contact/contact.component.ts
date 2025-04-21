// src/app/pages/contact/contact.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, ContactResponse } from '../../services/data.service';

@Component({
    selector: 'app-contact',
    standalone: false,
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
    contactForm: FormGroup;
    isSubmitting = false;
    submitStatus: 'success' | 'error' | null = null;
    submitMessage = '';
    // Có thể thêm isLoading, errorMessage nếu trang này cần load dữ liệu gì đó khác
    // Nhưng thường trang contact tĩnh nên không cần

    constructor(
        private fb: FormBuilder,
        private dataService: DataService
    ) {
        this.contactForm = this.fb.group({
            fullname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: [''], // Optional
            message: ['', Validators.required]
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        this.contactForm.markAllAsTouched(); // Hiển thị lỗi validation nếu click submit ngay
        if (this.contactForm.invalid) {
            return; // Không gửi nếu form không hợp lệ
        }

        this.isSubmitting = true;
        this.submitStatus = null;
        this.submitMessage = '';

        this.dataService.sendContactMessage(this.contactForm.value).subscribe({
            next: (response: ContactResponse) => {
                this.isSubmitting = false;
                this.submitStatus = 'success';
                this.submitMessage = response.message || 'Message sent successfully!';
                this.contactForm.reset();
                // Giữ form nhưng xóa trạng thái touched/dirty để bỏ validation errors
                this.contactForm.markAsPristine();
                this.contactForm.markAsUntouched();
                Object.values(this.contactForm.controls).forEach(control => {
                    control.setErrors(null);
                });
                // Optional: tự động ẩn thông báo sau vài giây
                setTimeout(() => this.submitStatus = null, 5000); // Ẩn sau 5s
            },
            error: (error) => {
                this.isSubmitting = false;
                this.submitStatus = 'error';
                this.submitMessage = error.message || 'Failed to send message. Please try again.';
                console.error('Contact form submission error:', error);
                // Optional: tự động ẩn thông báo sau vài giây
                setTimeout(() => this.submitStatus = null, 7000); // Ẩn sau 7s
            }
        });
    }

    // Getters for easier access in the template
    get fullname() { return this.contactForm.get('fullname'); }
    get email() { return this.contactForm.get('email'); }
    get message() { return this.contactForm.get('message'); }
}
