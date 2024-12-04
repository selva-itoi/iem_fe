import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseStaffWidgetsComponent } from './browse-staff-widgets.component';

describe('BrowseStaffWidgetsComponent', () => {
  let component: BrowseStaffWidgetsComponent;
  let fixture: ComponentFixture<BrowseStaffWidgetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseStaffWidgetsComponent]
    });
    fixture = TestBed.createComponent(BrowseStaffWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
