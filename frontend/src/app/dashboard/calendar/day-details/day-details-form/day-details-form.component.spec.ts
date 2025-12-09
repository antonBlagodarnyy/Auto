import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDetailsFormComponent } from './day-details-form.component';

describe('DayDetailsFormComponent', () => {
  let component: DayDetailsFormComponent;
  let fixture: ComponentFixture<DayDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
