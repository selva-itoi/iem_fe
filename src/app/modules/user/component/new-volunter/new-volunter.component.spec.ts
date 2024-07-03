import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVolunterComponent } from './new-volunter.component';

describe('NewVolunterComponent', () => {
  let component: NewVolunterComponent;
  let fixture: ComponentFixture<NewVolunterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVolunterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVolunterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
