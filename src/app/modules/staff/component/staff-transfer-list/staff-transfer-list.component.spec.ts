import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTransferListComponent } from './staff-transfer-list.component';

describe('StaffTransferListComponent', () => {
  let component: StaffTransferListComponent;
  let fixture: ComponentFixture<StaffTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffTransferListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
