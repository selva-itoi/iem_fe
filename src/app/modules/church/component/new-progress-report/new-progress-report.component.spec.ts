import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProgressReportComponent } from './new-progress-report.component';

describe('NewProgressReportComponent', () => {
  let component: NewProgressReportComponent;
  let fixture: ComponentFixture<NewProgressReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewProgressReportComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
