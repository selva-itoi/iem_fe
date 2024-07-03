import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTransferAddComponent } from './staff-transfer-add.component';

describe('StaffTransferAddComponent', () => {
  let component: StaffTransferAddComponent;
  let fixture: ComponentFixture<StaffTransferAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffTransferAddComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTransferAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
