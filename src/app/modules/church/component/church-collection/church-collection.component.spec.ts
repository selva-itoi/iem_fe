import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchCollectionComponent } from './church-collection.component';

describe('ChurchCollectionComponent', () => {
  let component: ChurchCollectionComponent;
  let fixture: ComponentFixture<ChurchCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChurchCollectionComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
