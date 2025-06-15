import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetails } from './product-details';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

describe('ProductDetails', () => {
  let component: ProductDetails;
  let fixture: ComponentFixture<ProductDetails>;

  const mockNestedGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    targetAudience: new FormControl(''),
    price: new FormControl('')
  });

  const mockFormGroupDirective = {
    control: new FormGroup({
      productDetails: mockNestedGroup
    })
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetails],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FormGroupDirective, useValue: mockFormGroupDirective }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
