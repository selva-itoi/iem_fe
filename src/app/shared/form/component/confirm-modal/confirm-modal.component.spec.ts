import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfimModalComponent } from './confim-modal.component';

describe('ConfimModalComponent', () => {
  let component: ConfimModalComponent;
  let fixture: ComponentFixture<ConfimModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ConfimModalComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfimModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
