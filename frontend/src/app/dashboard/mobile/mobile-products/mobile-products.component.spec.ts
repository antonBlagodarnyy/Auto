import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileProductsComponent } from './mobile-products.component';

describe('MobileProductsComponent', () => {
  let component: MobileProductsComponent;
  let fixture: ComponentFixture<MobileProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
