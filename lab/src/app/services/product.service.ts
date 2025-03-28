import { Injectable } from '@angular/core';
import { ProductModel } from '../product-card/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productData: ProductModel[] = [
        {
            "id": "5da0ac18-62b5-4837-bd94-7ac2ea380d2a",
            "name": "T-shirt",
            "desc": "A card component has a figure, a body part, and inside body there are title and actions parts",
            "star": "4.5",
            "price": 15000,
            "isBestSeller": true,
            "oldPrice": 20000,
            "ratingAmount": "2500",
            "colors": [
                {
                    "id": "id1",
                    "name": "red",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71RNFtWptaL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/61vXB9xiMGL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/61-eHXOk4LL._AC_SX425_.jpg",
                        "https://m.media-amazon.com/images/I/61M+PF4N8uL._AC_SX425_.jpg",
                        "https://m.media-amazon.com/images/I/61XQdMBNqRL._AC_SX425_.jpg"
                    ],
                    "sizes": ["S", "M", "L"],
                    "quantity": 100,
                    "instock": true
                },
                {
                    "id": "id2",
                    "name": "blue",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/719zXVC8RuL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71KeSzLL7DL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71DbElo9bOL._AC_SX522_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 51,
                    "instock": true
                },
                {
                    "id": "id3",
                    "name": "green",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/719zXVC8RuL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71KeSzLL7DL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71DbElo9bOL._AC_SX522_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 51,
                    "instock": true
                },
                {
                    "id": "id4",
                    "name": "orange",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/719zXVC8RuL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71KeSzLL7DL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71DbElo9bOL._AC_SX522_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 51,
                    "instock": true
                },
                {
                    "id": "id5",
                    "name": "pink",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/719zXVC8RuL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71KeSzLL7DL._AC_SX522_.jpg",
                        "https://m.media-amazon.com/images/I/71DbElo9bOL._AC_SX522_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 51,
                    "instock": true
                }
            ]
        },
        {
            "id": "b1234567-89ab-cdef-0123-456789abcdef",
            "name": "Jeans",
            "desc": "Classic denim jeans for everyday wear.",
            "star": "4.2",
            "price": 25000,
            "isBestSeller": false,
            "oldPrice": 30000,
            "ratingAmount": "1800",
            "colors": [
                {
                    "id": "id6",
                    "name": "dark blue",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71g0r5y4-dL._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/715QeB9gGvL._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71y6-2gG0lL._AC_SY879_.jpg"
                    ],
                    "sizes": ["30", "32", "34", "36"],
                    "quantity": 75,
                    "instock": true
                },
                {
                    "id": "id7",
                    "name": "light blue",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71p0WfQ5iOL._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71lF1Y4K-NL._AC_SY879_.jpg"
                    ],
                    "sizes": ["32", "34"],
                    "quantity": 30,
                    "instock": true
                }
            ]
        },
        {
            "id": "c2345678-9abc-def0-1234-567890abcdef",
            "name": "Hoodie",
            "desc": "Warm and comfortable hoodie for chilly days.",
            "star": "4.8",
            "price": 30000,
            "isBestSeller": true,
            "oldPrice": 35000,
            "ratingAmount": "3200",
            "colors": [
                {
                    "id": "id8",
                    "name": "gray",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/7106gq73W8L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/713q0g8592L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71v1iH937yL._AC_SY879_.jpg"
                    ],
                    "sizes": ["S", "M", "L", "XL"],
                    "quantity": 90,
                    "instock": true
                },
                {
                    "id": "id9",
                    "name": "black",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71r61tX7wYL._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71n5638n0KL._AC_SY879_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 45,
                    "instock": true
                }
            ]
        },
        {
            "id": "d3456789-abcd-ef01-2345-678901abcdef",
            "name": "Sneakers",
            "desc": "Stylish and comfortable sneakers for everyday wear.",
            "star": "4.6",
            "price": 40000,
            "isBestSeller": true,
            "oldPrice": 45000,
            "ratingAmount": "2800",
            "colors": [
                {
                    "id": "id10",
                    "name": "white",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/710vVk9wzAL._AC_SY695_.jpg",
                        "httpshttps://m.media-amazon.com/images/I/714h8V5qVdL._AC_SY695_.jpg",
                        "https://m.media-amazon.com/images/I/714f2430cBL._AC_SY695_.jpg"
                    ],
                    "sizes": ["39", "40", "41", "42"],
                    "quantity": 80,
                    "instock": true
                },
                {
                    "id": "id11",
                    "name": "brown",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/7178yF3lqOL._AC_SY695_.jpg",
                        "https://m.media-amazon.com/images/I/716h38r9KUL._AC_SY695_.jpg"
                    ],
                    "sizes": ["40", "41"],
                    "quantity": 60,
                    "instock": true
                }
            ]
        },
        {
            "id": "e4567890-bcde-f012-3456-789012abcdef",
            "name": "Dress",
            "desc": "Elegant dress for special occasions.",
            "star": "4.7",
            "price": 50000,
            "isBestSeller": false,
            "oldPrice": 55000,
            "ratingAmount": "2000",
            "colors": [
                {
                    "id": "id12",
                    "name": "beige",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-0819777L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-3315993L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-6782487L._AC_SY879_.jpg"
                    ],
                    "sizes": ["S", "M", "L"],
                    "quantity": 50,
                    "instock": true
                },
                {
                    "id": "id13",
                    "name": "navy",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-1188383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-5588383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 35,
                    "instock": true
                }
            ]
        },
        {
            "id": "f5678901-cdef-0123-4567-890123abcdef",
            "name": "Jacket",
            "desc": "Stylish and warm jacket for winter.",
            "star": "4.4",
            "price": 60000,
            "isBestSeller": false,
            "oldPrice": 65000,
            "ratingAmount": "1500",
            "colors": [
                {
                    "id": "id14",
                    "name": "khaki",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-7898383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-8898383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-9898383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["M", "L", "XL"],
                    "quantity": 40,
                    "instock": true
                },
                {
                    "id": "id15",
                    "name": "floral",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-1098383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-2098383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["L", "XL"],
                    "quantity": 25,
                    "instock": true
                }
            ]
        },
        {
            "id": "16789012-def0-1234-5678-901234abcdef",
            "name": "Sweater",
            "desc": "Cozy sweater for cold weather.",
            "star": "4.3",
            "price": 35000,
            "isBestSeller": false,
            "oldPrice": 40000,
            "ratingAmount": "1200",
            "colors": [
                {
                    "id": "id16",
                    "name": "lime",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-1298383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-2298383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-3298383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["S", "M", "L"],
                    "quantity": 55,
                    "instock": true
                },
                {
                    "id": "id17",
                    "name": "teal",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-4298383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-5298383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 30,
                    "instock": true
                }
            ]
        },
        {
            "id": "27890123-ef01-2345-6789-012345abcdef",
            "name": "Shorts",
            "desc": "Comfortable shorts for summer.",
            "star": "4.1",
            "price": 20000,
            "isBestSeller": false,
            "oldPrice": 25000,
            "ratingAmount": "1000",
            "colors": [
                {
                    "id": "id18",
                    "name": "cyan",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-6298383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-7298383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-8298383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["30", "32", "34"],
                    "quantity": 70,
                    "instock": true
                },
                {
                    "id": "id19",
                    "name": "indigo",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-9298383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-0398383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["32", "34"],
                    "quantity": 40,
                    "instock": true
                }
            ]
        },
        {
            "id": "38901234-f012-3456-7890-123456abcdef",
            "name": "Skirt",
            "desc": "Flowy skirt for a feminine look.",
            "star": "4.5",
            "price": 28000,
            "isBestSeller": false,
            "oldPrice": 32000,
            "ratingAmount": "1600",
            "colors": [
                {
                    "id": "id20",
                    "name": "violet",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-1398383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-2398383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-3398383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["S", "M", "L"],
                    "quantity": 65,
                    "instock": true
                },
                {
                    "id": "id21",
                    "name": "fuchsia",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-4398383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-5398383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["M", "L"],
                    "quantity": 38,
                    "instock": true
                }
            ]
        },
        {
            "id": "49012345-0123-4567-8901-234567abcdef",
            "name": "Hat",
            "desc": "Stylish hat to complete your outfit.",
            "star": "4.2",
            "price": 18000,
            "isBestSeller": false,
            "oldPrice": 22000,
            "ratingAmount": "900",
            "colors": [
                {
                    "id": "id22",
                    "name": "rose",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-6398383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-7398383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-8398383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["One Size"],
                    "quantity": 80,
                    "instock": true
                },
                {
                    "id": "id23",
                    "name": "amber",
                    "imgfollowColor": [
                        "https://m.media-amazon.com/images/I/71-9398383L._AC_SY879_.jpg",
                        "https://m.media-amazon.com/images/I/71-0498383L._AC_SY879_.jpg"
                    ],
                    "sizes": ["One Size"],
                    "quantity": 50,
                    "instock": true
                }
            ]
        }
    ];

    setProduct(product: ProductModel) {
        this.productData.push(product);
    }

    getProduct(): ProductModel[] {
        return this.productData;
    }

    getProductById(id: string): ProductModel | undefined {
        return this.productData.find(product => product.id === id);
    }
}
