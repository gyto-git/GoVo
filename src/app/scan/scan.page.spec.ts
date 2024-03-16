import { ComponentFixture, TestBed } from '@angular/core/testing';

import { scanPage } from './scan.page';

describe('scanPage', () => {
  let component: scanPage;
  let fixture: ComponentFixture<scanPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(scanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
