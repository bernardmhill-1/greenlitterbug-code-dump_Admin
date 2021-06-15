import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingProductTuypeComponent } from './recycling-product-tuype.component';

describe('RecyclingProductTuypeComponent', () => {
  let component: RecyclingProductTuypeComponent;
  let fixture: ComponentFixture<RecyclingProductTuypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecyclingProductTuypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecyclingProductTuypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
