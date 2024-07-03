import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildInfoComponent } from './child-info.component';

describe('ChildInfoComponent', () => {
  let component: ChildInfoComponent;
  let fixture: ComponentFixture<ChildInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
