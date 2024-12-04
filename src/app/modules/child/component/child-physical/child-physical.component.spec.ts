import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildPhysicalComponent } from './child-physical.component';

describe('ChildPhysicalComponent', () => {
  let component: ChildPhysicalComponent;
  let fixture: ComponentFixture<ChildPhysicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildPhysicalComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildPhysicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
