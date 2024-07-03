import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPromotionalOfficeComponent } from './new-promotional-office.component';

describe('NewPromotionalOfficeComponent', () => {
  let component: NewPromotionalOfficeComponent;
  let fixture: ComponentFixture<NewPromotionalOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPromotionalOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPromotionalOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
