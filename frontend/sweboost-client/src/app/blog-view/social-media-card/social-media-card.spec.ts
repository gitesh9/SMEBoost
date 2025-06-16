import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaCard } from './social-media-card';

describe('SocialMediaCard', () => {
  let component: SocialMediaCard;
  let fixture: ComponentFixture<SocialMediaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialMediaCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
