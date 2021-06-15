import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingProductComponent } from './recycling-product.component';

describe('RecyclingProductComponent', () => {
  let component: RecyclingProductComponent;
  let fixture: ComponentFixture<RecyclingProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecyclingProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecyclingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
