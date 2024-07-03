import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRefComponent } from './transaction-ref.component';

describe('TransactionRefComponent', () => {
  let component: TransactionRefComponent;
  let fixture: ComponentFixture<TransactionRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TransactionRefComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
