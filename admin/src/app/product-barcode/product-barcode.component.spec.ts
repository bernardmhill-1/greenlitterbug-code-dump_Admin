import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBarcodeComponent } from './product-barcode.component';

describe('ProductBarcodeComponent', () => {
  let component: ProductBarcodeComponent;
  let fixture: ComponentFixture<ProductBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
