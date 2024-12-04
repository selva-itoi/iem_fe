import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMonthlyReportListComponent } from './staff-monthly-report-list.component';

describe('StaffMonthlyReportListComponent', () => {
  let component: StaffMonthlyReportListComponent;
  let fixture: ComponentFixture<StaffMonthlyReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffMonthlyReportListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffMonthlyReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
