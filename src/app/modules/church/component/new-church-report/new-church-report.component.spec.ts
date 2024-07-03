import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChurchReportComponent } from './new-church-report.component';

describe('NewChurchReportComponent', () => {
  let component: NewChurchReportComponent;
  let fixture: ComponentFixture<NewChurchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewChurchReportComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChurchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
