import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DetailVoucherPage } from './detail-voucher.page';

describe('DetailVoucherPage', () => {
  let component: DetailVoucherPage;
  let fixture: ComponentFixture<DetailVoucherPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailVoucherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
