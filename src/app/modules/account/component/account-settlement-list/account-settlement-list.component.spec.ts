import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettlementListComponent } from './account-settlement-list.component';

describe('AccountSettlementListComponent', () => {
  let component: AccountSettlementListComponent;
  let fixture: ComponentFixture<AccountSettlementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AccountSettlementListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettlementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
