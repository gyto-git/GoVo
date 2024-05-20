import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AddVoucherPage } from './add-voucher.page';

describe('AddVoucherPage', () => {
  let component: AddVoucherPage;
  let fixture: ComponentFixture<AddVoucherPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddVoucherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
