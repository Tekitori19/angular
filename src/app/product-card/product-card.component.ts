import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorModel, ProductModel } from './product.model';

export interface EventProduct {
    name: string;
    colorName: string;
    price: number;
    quantity: number;
    choosedSize: string;
    isFavorite: boolean;
}

@Component({
    selector: 'app-product-card',
    standalone: false,
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
    @Input() product!: ProductModel
    imgColorID: string = '';
    selectedSize: string = '';
    carousel!: ColorModel | undefined
    sizes!: string[] | undefined
    instock!: boolean | undefined
    quantity: number | undefined
    defaultQuantity: number | undefined = 1
    colorName: string | undefined
    favouriteColor: string = ''
    addToCartColor: string = ''

    @Output() newProduct = new EventEmitter<EventProduct>()

    ngOnInit() {
        this.imgColorID = this.product.colors[0].id;
        this.carousel = this.product.colors.find(color => color.id === this.imgColorID);
        this.sizes = this.carousel?.sizes;
        this.instock = this.carousel?.instock;
        this.quantity = this.carousel?.quantity;
        this.defaultQuantity = this.quantity
        this.colorName = this.carousel?.name;
    }

    onColorChange() {
        this.carousel = this.product.colors.find(color => color.id === this.imgColorID);
        this.sizes = this.carousel?.sizes;
        this.instock = this.carousel?.instock;
        this.quantity = this.carousel?.quantity;
        this.colorName = this.carousel?.name;
    }

    handleFavourite() {
        this.favouriteColor = this.favouriteColor === 'text-red-500' ? '' : 'text-red-500';
    }

    handleAddToCart() {
        this.addToCartColor = this.addToCartColor === 'text-red-500' ? '' : 'text-red-500';
    }

    handleBuyNow() {
        console.log(this.quantity);

        if (!this.quantity || !this.selectedSize) return

        this.newProduct.emit({
            name: this.product.name,
            colorName: this.colorName!,
            price: this.product.price,
            quantity: this.quantity,
            choosedSize: this.selectedSize,
            isFavorite: this.favouriteColor === 'text-red-500' ? true : false
        })
    }
}
