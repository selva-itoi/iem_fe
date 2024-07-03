import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMonthlyReportNewComponent } from './staff-monthly-report-new.component';

describe('StaffMonthlyReportNewComponent', () => {
  let component: StaffMonthlyReportNewComponent;
  let fixture: ComponentFixture<StaffMonthlyReportNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffMonthlyReportNewComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffMonthlyReportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
