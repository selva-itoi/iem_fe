import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChildComponent } from './new-child.component';

describe('NewChildComponent', () => {
  let component: NewChildComponent;
  let fixture: ComponentFixture<NewChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewChildComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
