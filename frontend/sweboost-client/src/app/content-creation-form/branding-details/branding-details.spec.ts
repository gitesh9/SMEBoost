import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingDetails } from './branding-details';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

describe('BrandingDetails', () => {
  let component: BrandingDetails;
  let fixture: ComponentFixture<BrandingDetails>;

  const mockNestedGroup = new FormGroup({
    brandVoice: new FormControl(''),
    language: new FormControl(''),
    socialMediaLinks: new FormGroup({
      instagram: new FormControl(''),
      facebook: new FormControl(''),
      x: new FormControl('')
    })
  });

  const mockFormGroupDirective = {
    control: new FormGroup({
      brandingDetails: mockNestedGroup
    })
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandingDetails],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FormGroupDirective, useValue: mockFormGroupDirective }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
