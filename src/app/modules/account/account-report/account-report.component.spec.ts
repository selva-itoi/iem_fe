import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReportComponent } from './account-report.component';

describe('AccountReportComponent', () => {
  let component: AccountReportComponent;
  let fixture: ComponentFixture<AccountReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountReportComponent]
    });
    fixture = TestBed.createComponent(AccountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
