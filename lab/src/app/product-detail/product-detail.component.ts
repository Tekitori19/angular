import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from '../product-card/product.model';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-product-detail',
    standalone: false,
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
    route: ActivatedRoute = inject(ActivatedRoute);
    id: string;
    product!: ProductModel | undefined;

    constructor(private productService: ProductService) {
        this.id = this.route.snapshot.params['id'];
    }

    ngOnInit() {
        this.product = this.productService.getProductById(this.id);
    }
}
