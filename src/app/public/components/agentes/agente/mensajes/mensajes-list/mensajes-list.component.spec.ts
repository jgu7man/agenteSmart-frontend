import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesListComponent } from './mensajes-list.component';

describe('MensajesListComponent', () => {
  let component: MensajesListComponent;
  let fixture: ComponentFixture<MensajesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
