import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayrollHeadComponent } from './new-payroll-head.component';

describe('NewPayrollHeadComponent', () => {
  let component: NewPayrollHeadComponent;
  let fixture: ComponentFixture<NewPayrollHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewPayrollHeadComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPayrollHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
