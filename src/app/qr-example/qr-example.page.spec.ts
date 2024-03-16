import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrExamplePage } from './qr-example.page';

describe('QrExamplePage', () => {
  let component: QrExamplePage;
  let fixture: ComponentFixture<QrExamplePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QrExamplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
