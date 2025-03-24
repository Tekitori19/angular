export interface ProductModel {
    id: string
    name: string
    desc: string
    star: string
    price: number
    oldPrice: number
    isBestSeller: boolean
    ratingAmount: string
    colors: ColorModel[]
}

export interface ColorModel {
    id: string
    name: string
    imgfollowColor: string[]
    sizes: string[]
    quantity: number
    instock: boolean
}
