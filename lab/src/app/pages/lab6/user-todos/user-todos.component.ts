import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

interface Todo {
    id: number;
    user_id: number;
    title: string;
    due_on: string;
    status: 'pending' | 'completed';
}

@Component({
    selector: 'app-user-todos',
    standalone: false,
    templateUrl: './user-todos.component.html',
    styleUrl: './user-todos.component.css'
})
export class UserTodosComponent {
    userId = '7380134';
    todos: Todo[] = [];
    loading = false;
    error = '';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchUserTodos();
    }

    fetchUserTodos(): void {
        this.loading = true;
        this.error = '';

        this.http.get<Todo[]>(`https://gorest.co.in/public/v2/users/${this.userId}/todos`)
            .subscribe({
                next: (response) => {
                    this.todos = response;
                    this.loading = false;
                    console.log(this.todos);
                },
                error: (err) => {
                    this.error = 'Có lỗi xảy ra khi tải danh sách todo. Vui lòng thử lại sau.';
                    this.loading = false;
                    console.error('Error fetching todos:', err);
                }
            });
    }
}
