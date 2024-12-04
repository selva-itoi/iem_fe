import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffBasicComponent } from './staff-basic.component';

describe('StaffBasicComponent', () => {
  let component: StaffBasicComponent;
  let fixture: ComponentFixture<StaffBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffBasicComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
