// product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    standalone: false,
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    productForm!: FormGroup;
    availableColors = [
        { id: 'red', name: 'Đỏ' },
        { id: 'blue', name: 'Xanh dương' },
        { id: 'green', name: 'Xanh lá' },
        { id: 'yellow', name: 'Vàng' },
        { id: 'black', name: 'Đen' },
        { id: 'white', name: 'Trắng' }
    ];
    selectedPhotos: File[] = [];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.productForm = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(50)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(250)
            ]],
            price: ['', [
                Validators.required,
                Validators.min(1),
                Validators.max(100)
            ]],
            colors: this.fb.array([], [Validators.required, Validators.minLength(1)]),
            photos: this.fb.array([], [Validators.required, Validators.minLength(1)])
        });
    }

    // Getter methods for form controls
    get name() { return this.productForm.get('name'); }
    get description() { return this.productForm.get('description'); }
    get price() { return this.productForm.get('price'); }
    get colors() { return this.productForm.get('colors') as FormArray; }
    get photos() { return this.productForm.get('photos') as FormArray; }

    onColorChange(event: any, colorId: string) {
        const colorsArray = this.productForm.get('colors') as FormArray;

        if (event.target.checked) {
            colorsArray.push(this.fb.control(colorId));
        } else {
            const index = colorsArray.controls.findIndex(control => control.value === colorId);
            if (index !== -1) {
                colorsArray.removeAt(index);
            }
        }
    }

    isColorSelected(colorId: string): boolean {
        const colorsArray = this.productForm.get('colors') as FormArray;
        return colorsArray.controls.some(control => control.value === colorId);
    }

    onFileChange(event: any) {
        const files = event.target.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                this.selectedPhotos.push(files[i]);
                const photosArray = this.productForm.get('photos') as FormArray;
                photosArray.push(this.fb.control(files[i].name));
            }
        }
    }

    removePhoto(index: number) {
        this.selectedPhotos.splice(index, 1);
        const photosArray = this.productForm.get('photos') as FormArray;
        photosArray.removeAt(index);
    }

    onSubmit() {
        if (this.productForm.valid) {
            console.log('Form submitted:', this.productForm.value);
            // Here you would send the data to your server
            alert('Sản phẩm đã được thêm thành công!');
            this.productForm.reset();
            this.selectedPhotos = [];
        } else {
            // Mark all fields as touched to trigger validation messages
            this.markFormGroupTouched(this.productForm);
        }
    }

    // Helper method to mark all controls in a form group as touched
    markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
