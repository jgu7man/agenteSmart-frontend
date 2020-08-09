import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaHeaderComponent } from './entrada-header.component';

describe('EntradaHeaderComponent', () => {
  let component: EntradaHeaderComponent;
  let fixture: ComponentFixture<EntradaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
