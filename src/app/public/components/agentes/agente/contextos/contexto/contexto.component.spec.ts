import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextoComponent } from './contexto.component';

describe('ContextoComponent', () => {
  let component: ContextoComponent;
  let fixture: ComponentFixture<ContextoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
