import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetInfoComponent } from './balance-sheet-info.component';

describe('BalanceSheetInfoComponent', () => {
  let component: BalanceSheetInfoComponent;
  let fixture: ComponentFixture<BalanceSheetInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceSheetInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSheetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
