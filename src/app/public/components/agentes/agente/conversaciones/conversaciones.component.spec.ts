import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversacionesComponent } from './conversaciones.component';

describe('ConversacionesComponent', () => {
  let component: ConversacionesComponent;
  let fixture: ComponentFixture<ConversacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
