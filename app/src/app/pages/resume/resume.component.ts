// src/app/pages/resume/resume.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of, tap } from 'rxjs';
// Import interfaces
import { DataService, Education, Experience, Skill } from '../../services/data.service';

@Component({
    selector: 'app-resume',
    standalone: false,
    templateUrl: './resume.component.html',
    styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

    // Observables for data sections
    education$: Observable<Education[]> = of([]);
    experience$: Observable<Experience[]> = of([]);
    skills$: Observable<Skill[]> = of([]);

    isLoading = true;
    errorMessage: string | null = null;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.errorMessage = null;
        console.log("ResumeComponent ngOnInit: Fetching data...");

        const portfolioData$ = this.dataService.getPortfolioData();

        // Map data for each section
        this.education$ = portfolioData$.pipe(map(data => data?.education || []));
        this.experience$ = portfolioData$.pipe(map(data => data?.experience || []));
        this.skills$ = portfolioData$.pipe(map(data => data?.skills || []));

        // Handle overall loading and error state
        portfolioData$.subscribe({
            next: (data) => {
                console.log("ResumeComponent ngOnInit: Data received successfully.");
                this.isLoading = false;
            },
            error: (err) => {
                console.error("ResumeComponent ngOnInit: Error fetching data:", err);
                this.errorMessage = err.message || 'Failed to load Resume data.';
                this.isLoading = false;
            }
        });
    }
}
