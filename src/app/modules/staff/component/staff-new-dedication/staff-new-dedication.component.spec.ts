import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffNewDedicationComponent } from './staff-new-dedication.component';

describe('StaffNewDedicationComponent', () => {
  let component: StaffNewDedicationComponent;
  let fixture: ComponentFixture<StaffNewDedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffNewDedicationComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffNewDedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
