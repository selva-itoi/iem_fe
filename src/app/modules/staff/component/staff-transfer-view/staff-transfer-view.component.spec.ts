import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTransferViewComponent } from './staff-transfer-view.component';

describe('StaffTransferViewComponent', () => {
  let component: StaffTransferViewComponent;
  let fixture: ComponentFixture<StaffTransferViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffTransferViewComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTransferViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
