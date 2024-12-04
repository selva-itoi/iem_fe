import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDedicationListComponent } from './staff-dedication-list.component';

describe('StaffDedicationListComponent', () => {
  let component: StaffDedicationListComponent;
  let fixture: ComponentFixture<StaffDedicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffDedicationListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDedicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
