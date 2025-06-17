import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoBlog } from './demo-blog';

describe('DemoBlog', () => {
  let component: DemoBlog;
  let fixture: ComponentFixture<DemoBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
