import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelMensajeDialogComponent } from './del-mensaje-dialog.component';

describe('DelMensajeDialogComponent', () => {
  let component: DelMensajeDialogComponent;
  let fixture: ComponentFixture<DelMensajeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelMensajeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelMensajeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
