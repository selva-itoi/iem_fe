import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMagazineComponent } from './new-magazine.component';

describe('NewMagazineComponent', () => {
  let component: NewMagazineComponent;
  let fixture: ComponentFixture<NewMagazineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMagazineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMagazineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
