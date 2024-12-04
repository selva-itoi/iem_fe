import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunterListComponent } from './volunter-list.component';

describe('VolunterListComponent', () => {
  let component: VolunterListComponent;
  let fixture: ComponentFixture<VolunterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
