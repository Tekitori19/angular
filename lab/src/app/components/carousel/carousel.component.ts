import { Component, Input, OnInit } from '@angular/core';
import { ColorModel } from '../../product-card/product.model';

@Component({
    selector: 'app-carousel',
    standalone: false,
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
    @Input() slides!: ColorModel | undefined
    carouselId!: string

    ngOnInit(): void {
        this.carouselId = this.slides ? this.slides.id : 'carousel';
    }
}
