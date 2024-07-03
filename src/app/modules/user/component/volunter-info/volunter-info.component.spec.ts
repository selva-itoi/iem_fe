import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunterInfoComponent } from './volunter-info.component';

describe('VolunterInfoComponent', () => {
  let component: VolunterInfoComponent;
  let fixture: ComponentFixture<VolunterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunterInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
