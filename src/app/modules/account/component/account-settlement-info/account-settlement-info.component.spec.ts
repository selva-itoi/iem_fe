import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettlementInfoComponent } from './account-settlement-info.component';

describe('AccountSettlementInfoComponent', () => {
  let component: AccountSettlementInfoComponent;
  let fixture: ComponentFixture<AccountSettlementInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AccountSettlementInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettlementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
