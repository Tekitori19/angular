import { Component, Input, OnInit } from '@angular/core';
import { ColorModel, ProductModel } from './product.model';

@Component({
    selector: 'app-product-card',
    standalone: false,
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
    @Input() product!: ProductModel
    className!: string
    imgColorID: string = ''; // This will hold the selected color value
    carousel!: ColorModel | undefined
    sizes!: string[] | undefined
    instock!: boolean | undefined
    quantity: number | undefined
    favouriteColor: string = ''
    addToCartColor: string = ''

    ngOnInit() {
        this.imgColorID = this.product.colors[0].id; // Set the first color as default
        this.carousel = this.product.colors.find(color => color.id === this.imgColorID);
        this.sizes = this.carousel?.sizes;
        this.instock = this.carousel?.instock;
        this.quantity = this.carousel?.quantity;
    }

    onColorChange() {
        this.carousel = this.product.colors.find(color => color.id === this.imgColorID);
        this.sizes = this.carousel?.sizes;
        this.instock = this.carousel?.instock;
        this.quantity = this.carousel?.quantity;
    }

    handleFavourite() {
        this.favouriteColor = this.favouriteColor === 'text-red-500' ? '' : 'text-red-500';
    }

    handleAddToCart() {
        this.addToCartColor = this.addToCartColor === 'text-red-500' ? '' : 'text-red-500';
    }

    handleBuyNow() {
        console.log(this.imgColorID);
    }
}
