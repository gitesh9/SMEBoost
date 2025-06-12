import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingDetails } from './branding-details';

describe('BrandingDetails', () => {
  let component: BrandingDetails;
  let fixture: ComponentFixture<BrandingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
