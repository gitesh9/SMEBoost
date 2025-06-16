import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogView } from './blog-view';
import { SocialMediaCard } from './social-media-card/social-media-card';
import { RouterModule, provideRouter } from '@angular/router';

describe('BlogView', () => {
  let component: BlogView;
  let fixture: ComponentFixture<BlogView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogView, SocialMediaCard],
      imports: [RouterModule],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BlogView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
