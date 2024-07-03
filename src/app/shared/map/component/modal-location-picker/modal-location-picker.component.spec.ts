import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLocationPickerComponent } from './modal-location-picker.component';

describe('ModalLocationPickerComponent', () => {
  let component: ModalLocationPickerComponent;
  let fixture: ComponentFixture<ModalLocationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ModalLocationPickerComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLocationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
