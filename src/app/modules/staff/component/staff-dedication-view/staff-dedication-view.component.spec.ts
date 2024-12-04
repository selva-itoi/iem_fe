import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDedicationViewComponent } from './staff-dedication-view.component';

describe('StaffDedicationViewComponent', () => {
  let component: StaffDedicationViewComponent;
  let fixture: ComponentFixture<StaffDedicationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffDedicationViewComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDedicationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
