import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


interface Post {
    id: number;
    user_id: number;
    title: string;
    body: string;
}

@Component({
    selector: 'app-user-posts',
    standalone: false,
    templateUrl: './user-posts.component.html',
    styleUrl: './user-posts.component.css'
})
export class UserPostsComponent implements OnInit {
    userId = '7380134'
    posts: Post[] = [];
    loading = false;
    error = '';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchUserPosts();
    }

    fetchUserPosts(): void {
        this.loading = true;
        this.error = '';

        this.http.get<Post[]>(`https://gorest.co.in/public/v2/users/${this.userId}/posts`)
            .subscribe({
                next: (response) => {
                    this.posts = response;
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Có lỗi xảy ra khi tải danh sách bài viết. Vui lòng thử lại sau.';
                    this.loading = false;
                    console.error('Error fetching posts:', err);
                }
            });
    }
}
