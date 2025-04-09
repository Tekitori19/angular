import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

interface TodoRequest {
    title: string;
    status: 'pending' | 'completed';
    due_on?: string;
}

interface TodoResponse {
    id: number;
    user_id: number;
    title: string;
    due_on: string;
    status: 'pending' | 'completed';
}

@Component({
    selector: 'app-create-todo',
    standalone: false,
    templateUrl: './create-todo.component.html',
    styleUrl: './create-todo.component.css'
})
export class CreateTodoComponent {
    userId = '7380134';

    // Lưu ý: Trong ứng dụng thực tế, bạn không nên hard-code token như thế này
    apiToken = environment.apiToken;

    todoData: TodoRequest = {
        title: '',
        status: 'pending'
    };

    dueDate: string = '';
    loading = false;
    success = false;
    error = '';

    constructor(private http: HttpClient) { }

    onSubmit(): void {
        this.loading = true;
        this.success = false;
        this.error = '';

        // Nếu người dùng chọn due date, thêm vào request
        if (this.dueDate) {
            this.todoData.due_on = new Date(this.dueDate).toISOString();
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiToken}`
        });

        this.http.post<TodoResponse>(
            `https://gorest.co.in/public/v2/users/${this.userId}/todos`,
            this.todoData,
            { headers }
        ).subscribe({
            next: (response) => {
                console.log('Todo created successfully:', response);
                this.loading = false;
                this.success = true;

                // Reset form
                this.todoData = {
                    title: '',
                    status: 'pending'
                };
                this.dueDate = '';
            },
            error: (err) => {
                console.error('Error creating todo:', err);
                this.loading = false;
                this.error = `Lỗi: ${err.error?.message || 'Không thể tạo todo. Vui lòng kiểm tra API token.'}`;
            }
        });
    }
}
