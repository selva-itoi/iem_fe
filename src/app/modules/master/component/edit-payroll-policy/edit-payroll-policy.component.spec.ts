import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPayrollPolicyComponent } from './edit-payroll-policy.component';

describe('EditPayrollPolicyComponent', () => {
  let component: EditPayrollPolicyComponent;
  let fixture: ComponentFixture<EditPayrollPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditPayrollPolicyComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPayrollPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
