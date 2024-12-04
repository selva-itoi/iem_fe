import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGoalsReportComponent } from './new-goals-report.component';

describe('NewGoalsReportComponent', () => {
  let component: NewGoalsReportComponent;
  let fixture: ComponentFixture<NewGoalsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGoalsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGoalsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
