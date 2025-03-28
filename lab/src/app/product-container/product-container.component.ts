import { Component } from '@angular/core';
import { EventProduct } from '../product-card/product-card.component';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../product-card/product.model';

@Component({
    selector: 'app-product-container',
    standalone: false,
    templateUrl: './product-container.component.html',
    styleUrl: './product-container.component.css',
})
export class ProductContainerComponent {
    eventList: EventProduct[] = [];
    totalPrice: number = 0;
    products!: ProductModel[];

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.products = this.productService.getProduct();
        console.log('Product:', this.products);
    }

    showEvent(event: EventProduct) {
        this.eventList.push(event);
        this.totalPrice += event.price * event.quantity;
    }
}
