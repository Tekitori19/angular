import { Component } from '@angular/core';

@Component({
    selector: 'app-lab6',
    standalone: false,
    templateUrl: './lab6.component.html',
    styleUrl: './lab6.component.css'
})
export class Lab6Component {
    activeTab = 'posts';
    currentYear = new Date().getFullYear();

    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }

    getActiveTabTitle(): string {
        switch (this.activeTab) {
            case 'posts':
                return 'Danh sách bài viết của User';
            case 'todos':
                return 'Danh sách Todos của User';
            case 'create-todo':
                return 'Tạo Todo mới';
            default:
                return '';
        }
    }
}
