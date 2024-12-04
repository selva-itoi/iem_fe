import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildReportAddComponent } from './child-report-add.component';

describe('ChildReportAddComponent', () => {
  let component: ChildReportAddComponent;
  let fixture: ComponentFixture<ChildReportAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildReportAddComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildReportAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
