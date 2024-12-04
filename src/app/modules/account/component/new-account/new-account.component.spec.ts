import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayrollAccountComponent } from './new-payroll-account.component';

describe('NewPayrollAccountComponent', () => {
  let component: NewPayrollAccountComponent;
  let fixture: ComponentFixture<NewPayrollAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewPayrollAccountComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPayrollAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
