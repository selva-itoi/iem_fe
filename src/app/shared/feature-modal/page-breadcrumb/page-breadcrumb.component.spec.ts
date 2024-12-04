import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBreadcrumbComponent } from './page-breadcrumb.component';

describe('PageBreadcrumbComponent', () => {
  let component: PageBreadcrumbComponent;
  let fixture: ComponentFixture<PageBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PageBreadcrumbComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
