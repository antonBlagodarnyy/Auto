import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileClientsComponent } from './mobile-clients.component';

describe('MobileClientsComponent', () => {
  let component: MobileClientsComponent;
  let fixture: ComponentFixture<MobileClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
