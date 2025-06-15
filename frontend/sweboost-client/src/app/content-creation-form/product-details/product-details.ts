import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ProductDetails implements OnInit {
  productForm!: FormGroup;
  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.productForm = this.controlContainer.control?.get('productDetails') as FormGroup;
  }
}
