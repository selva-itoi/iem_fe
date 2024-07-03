import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDataComponent } from './receipt-data.component';

describe('ReceiptDataComponent', () => {
  let component: ReceiptDataComponent;
  let fixture: ComponentFixture<ReceiptDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
