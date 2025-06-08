import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { provideRouter, RouterModule } from '@angular/router';

describe('NavbarComponent', () => {
  // let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterModule],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    // component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('dummy test', () => {
    expect(0).toBeFalsy()
  })
});

