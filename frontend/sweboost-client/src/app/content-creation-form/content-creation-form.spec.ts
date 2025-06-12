import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCreationForm } from './content-creation-form';
import { BusinessDetails } from './business-details/business-details';
import { BrandingDetails } from './branding-details/branding-details';
import { ProductDetails } from './product-details/product-details';

describe('ContentCreationForm', () => {
  let component: ContentCreationForm;
  let fixture: ComponentFixture<ContentCreationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentCreationForm, BusinessDetails, BrandingDetails, ProductDetails]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContentCreationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
