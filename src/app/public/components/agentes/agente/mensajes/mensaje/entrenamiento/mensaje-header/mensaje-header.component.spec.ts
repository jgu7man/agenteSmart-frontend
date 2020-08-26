import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeHeaderComponent } from './mensaje-header.component';

describe('MensajeHeaderComponent', () => {
  let component: MensajeHeaderComponent;
  let fixture: ComponentFixture<MensajeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
