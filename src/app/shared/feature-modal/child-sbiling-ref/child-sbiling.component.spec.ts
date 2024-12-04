import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSbilingComponent } from './child-sbiling.component';

describe('ChildSbilingComponent', () => {
  let component: ChildSbilingComponent;
  let fixture: ComponentFixture<ChildSbilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildSbilingComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildSbilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
