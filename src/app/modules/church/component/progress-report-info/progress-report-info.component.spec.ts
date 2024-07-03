import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressReportInfoComponent } from './progress-report-info.component';

describe('ProgressReportInfoComponent', () => {
  let component: ProgressReportInfoComponent;
  let fixture: ComponentFixture<ProgressReportInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ProgressReportInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressReportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
