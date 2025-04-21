// src/app/pages/certificate-detail/certificate-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, of, tap, catchError, takeUntil, map } from 'rxjs'; // map thêm vào
import { DataService, Certificate } from '../../services/data.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-certificate-detail',
    standalone: false,
    templateUrl: './certificate-detail.component.html',
    styleUrls: ['./certificate-detail.component.css']
})
export class CertificateDetailComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    certificate: Certificate | null | undefined = undefined;
    isLoading = true;
    errorMessage: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private router: Router,
        private titleService: Title
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.certificate = undefined;

        this.route.paramMap.pipe(
            map(params => params.get('id')), // Lấy id từ URL (là string)
            tap(id => console.log(`CertificateDetail: Found id in URL: ${id}`)),
            switchMap(idString => {
                const id = Number(idString); // <<< Chuyển id từ string sang number
                if (id && !isNaN(id)) { // Kiểm tra id hợp lệ
                    return this.dataService.getCertificateById(id).pipe(
                        catchError(err => {
                            this.errorMessage = `Error loading certificate: ${err.message}`;
                            console.error("CertificateDetail Error from service:", err);
                            return of(null);
                        })
                    );
                } else {
                    this.errorMessage = 'Invalid or missing certificate ID in the URL.';
                    return of(null);
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe(foundCertificate => {
            this.isLoading = false;
            this.certificate = foundCertificate;

            if (this.certificate) {
                console.log("CertificateDetail: Certificate data loaded:", this.certificate);
                this.titleService.setTitle(`${this.certificate.name} - Certificate Details`);
            } else {
                console.log("CertificateDetail: Certificate not found or error loading.");
                if (!this.errorMessage) {
                    this.errorMessage = this.errorMessage || 'Certificate not found.';
                }
                this.titleService.setTitle('Certificate Not Found');
                // Optional: redirect back
                // setTimeout(() => this.router.navigate(['/resume']), 3000); // Chuyển về resume?
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        console.log("CertificateDetail: Component destroyed.");
    }

    formatDescription(description: string | null | undefined): string {
        if (!description) {
            return '';
        }
        return description.replace(/\n/g, '<br>');
    }
}
