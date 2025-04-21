// src/app/pages/certificates/certificates.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { DataService, Certificate } from '../../services/data.service';

@Component({
    selector: 'app-certificates',
    standalone: false,
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {

    certificates$: Observable<Certificate[]> = of([]);
    isLoading = true;
    errorMessage: string | null = null;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;
        console.log("CertificatesComponent ngOnInit: Fetching data...");

        const portfolioData$ = this.dataService.getPortfolioData();

        // Lấy mảng certificates
        this.certificates$ = portfolioData$.pipe(map(data => data?.certificates || []));

        // Xử lý loading/error chung
        portfolioData$.subscribe({
            next: () => {
                console.log("CertificatesComponent ngOnInit: Data resolved.");
                this.isLoading = false;
            },
            error: (err) => {
                console.error("CertificatesComponent ngOnInit: Error fetching data:", err);
                this.errorMessage = err.message || 'Failed to load certificates.';
                this.isLoading = false;
            }
        });
    }
}
