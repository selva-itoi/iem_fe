import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildBasicInfoComponent } from './child-basic-info.component';

describe('ChildBasicInfoComponent', () => {
  let component: ChildBasicInfoComponent;
  let fixture: ComponentFixture<ChildBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildBasicInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
