import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAccountListComponent } from './payroll-account-list.component';

describe('PayrollAccountListComponent', () => {
  let component: PayrollAccountListComponent;
  let fixture: ComponentFixture<PayrollAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PayrollAccountListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
