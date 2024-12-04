import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountSettlementComponent } from './new-account-settlement.component';

describe('NewAccountSettlementComponent', () => {
  let component: NewAccountSettlementComponent;
  let fixture: ComponentFixture<NewAccountSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewAccountSettlementComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAccountSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
