import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInsights } from './customer-insights';

describe('CustomerInsights', () => {
  let component: CustomerInsights;
  let fixture: ComponentFixture<CustomerInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerInsights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerInsights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
