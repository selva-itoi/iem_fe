import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabHeadComponent } from './tab-head.component';

describe('TabHeadComponent', () => {
  let component: TabHeadComponent;
  let fixture: ComponentFixture<TabHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TabHeadComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
