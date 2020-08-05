import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextosComponent } from './contextos.component';

describe('ContextosComponent', () => {
  let component: ContextosComponent;
  let fixture: ComponentFixture<ContextosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
