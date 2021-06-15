import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingProductScanMessageComponent } from './recycling-product-scan-message.component';

describe('RecyclingProductScanMessageComponent', () => {
  let component: RecyclingProductScanMessageComponent;
  let fixture: ComponentFixture<RecyclingProductScanMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecyclingProductScanMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecyclingProductScanMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
