import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollSettingComponent } from './payroll-setting.component';

describe('PayrollSettingComponent', () => {
  let component: PayrollSettingComponent;
  let fixture: ComponentFixture<PayrollSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PayrollSettingComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
