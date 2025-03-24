import { Component } from '@angular/core';
import { ProductModel } from './product-card/product.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Phan Dương Định';
    mssv = 'MSSV: PD09993';
    product: ProductModel = {
        id: "5da0ac18-62b5-4837-bd94-7ac2ea380d2a",
        name: 'T-shirt',
        desc: 'A card component has a figure, a body part, and inside body there are title and actions parts',
        star: '4.5',
        price: 15000,
        isBestSeller: true,
        oldPrice: 20000,
        ratingAmount: '2500',
        colors: [
            {
                id: "id1",
                name: 'red',
                imgfollowColor: [
                    'https://m.media-amazon.com/images/I/71RNFtWptaL._AC_SX522_.jpg',
                    'https://m.media-amazon.com/images/I/61vXB9xiMGL._AC_SX522_.jpg',
                    'https://m.media-amazon.com/images/I/61-eHXOk4LL._AC_SX425_.jpg',
                    'https://m.media-amazon.com/images/I/61M+PF4N8uL._AC_SX425_.jpg',
                    'https://m.media-amazon.com/images/I/61XQdMBNqRL._AC_SX425_.jpg'
                ],
                sizes: [
                    "45*53",
                    "42*40",
                    "40*40",
                    "35*49",
                ],
                quantity: 100,
                instock: true,
            },
            {
                id: "id2",
                name: 'blue',
                imgfollowColor: [
                    "https://m.media-amazon.com/images/I/719zXVC8RuL._AC_SX522_.jpg",
                    "https://m.media-amazon.com/images/I/71KeSzLL7DL._AC_SX522_.jpg",
                    "https://m.media-amazon.com/images/I/71DbElo9bOL._AC_SX522_.jpg"
                ],
                sizes: [
                    "45*53",
                    "40*40",
                ],
                quantity: 51,
                instock: false,
            },
        ]
    };
    product2: ProductModel = {
        id: "e55f3845-6cd6-4b8f-aeb7-4195009a3d95",
        name: 'xml',
        desc: 'A card component has a figure, a body part, and inside body there are title and actions parts',
        star: '4.5',
        price: 5000,
        isBestSeller: true,
        oldPrice: 2000,
        ratingAmount: '2500',
        colors: [
            {
                id: "id3",
                name: 'red',
                imgfollowColor: ['red-tshirt.jpg', 'blue-tshirt.jpg', 'orange-tshirt.jpg', 'green-tshirt.jpg', 'pink-tshirt.jpg'],
                sizes: [
                    "45*53",
                    "42*40",
                    "40*40",
                    "35*49",
                ],
                quantity: 10,
                instock: true,
            },
            {
                id: "id4",
                name: 'blue',
                imgfollowColor: ['blue-tshirt.jpg', 'red-tshirt.jpg', 'orange-tshirt.jpg', 'green-tshirt.jpg', 'pink-tshirt.jpg'],
                sizes: [
                    "45*53",
                    "42*40",
                    "40*40",
                    "35*49",
                ],
                quantity: 10,
                instock: true,
            },
        ]
    };

}
