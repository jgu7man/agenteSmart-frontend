import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelEntradaDialogComponent } from './del-entrada-dialog.component';

describe('DelEntradaDialogComponent', () => {
  let component: DelEntradaDialogComponent;
  let fixture: ComponentFixture<DelEntradaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelEntradaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelEntradaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
