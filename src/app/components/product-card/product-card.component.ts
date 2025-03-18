import { Component } from '@angular/core';
import { ProductModel } from './product.model';

@Component({
    selector: 'app-product-card',
    standalone: false,
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
    product: ProductModel = {
        name: 'T-shirt',
        desc: 'A card component has a figure, a body part, and inside body there are title and actions parts',
        star: '4.5',
        price: 15000,
        isBestSeller: true,
        oldPrice: 20000,
        ratingAmount: '2500',
        colors: {
            colorName: ['red', 'blue', 'orange', 'green', 'pink'],
            imgfollowColor: ['red-tshirt.jpg', 'blue-tshirt.jpg', 'orange-tshirt.jpg', 'green-tshirt.jpg', 'pink-tshirt.jpg']
        },
        sizes: [
            "45*53",
            "42*40",
            "40*40",
            "35*49",
        ],
        quantity: 20,
        instock: false
    };
}
