import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInsights } from './customer-insights';
import { FormGroup, FormControl, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

describe('CustomerInsights', () => {
  let component: CustomerInsights;
  let fixture: ComponentFixture<CustomerInsights>;

  const mockNestedGroup = new FormGroup({
    demographics: new FormControl(''),
    preferences: new FormControl(''),
    reviewsTestimonials: new FormControl(''),
    FAQs: new FormControl('')
  });

  const mockFormGroupDirective = {
    control: new FormGroup({
      customerDetails: mockNestedGroup
    })
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerInsights],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FormGroupDirective, useValue: mockFormGroupDirective }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerInsights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
