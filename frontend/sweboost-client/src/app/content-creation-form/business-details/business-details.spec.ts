import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDetails } from './business-details';
import { FormGroup, FormControl, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

describe('BusinessDetails', () => {
  let component: BusinessDetails;
  let fixture: ComponentFixture<BusinessDetails>;

  const mockNestedGroup = new FormGroup({
    name: new FormControl(''),
    type: new FormControl(''),
    logo: new FormControl(''),
  });

  const mockFormGroupDirective = {
    control: new FormGroup({
      businessDetails: mockNestedGroup
    })
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessDetails],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FormGroupDirective, useValue: mockFormGroupDirective }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
