import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayroleMasterComponent } from './payrole-master.component';

describe('PayroleMasterComponent', () => {
  let component: PayroleMasterComponent;
  let fixture: ComponentFixture<PayroleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PayroleMasterComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayroleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
