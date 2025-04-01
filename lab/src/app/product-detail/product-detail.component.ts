import { Component, OnInit } from '@angular/core';
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
    id: string = '';
    product: ProductModel | undefined;
    selectedColor: any;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.product = this.productService.getProductById(this.id);
        });
    }

    selectColor(index: number) {
        this.selectedColor = this.product?.colors[index];
    }
}
