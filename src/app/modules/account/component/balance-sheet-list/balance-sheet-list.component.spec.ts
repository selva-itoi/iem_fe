import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetListComponent } from './balance-sheet-list.component';

describe('BalanceSheetListComponent', () => {
  let component: BalanceSheetListComponent;
  let fixture: ComponentFixture<BalanceSheetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceSheetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSheetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
