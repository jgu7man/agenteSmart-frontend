import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionalResFormComponent } from './condicional-res-form.component';

describe('CondicionalResFormComponent', () => {
  let component: CondicionalResFormComponent;
  let fixture: ComponentFixture<CondicionalResFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionalResFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionalResFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
