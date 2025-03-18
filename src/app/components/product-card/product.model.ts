export interface ProductModel {
    name: string
    desc: string
    star: string
    price: number
    oldPrice: number
    isBestSeller: boolean
    ratingAmount: string
    colors: ColorModel
    sizes: string[]
    quantity: number
    instock: boolean
}

export interface ColorModel {
    colorName: ("red" | "blue" | "orange" | "green" | "pink")[];
    imgfollowColor: string[]
}
