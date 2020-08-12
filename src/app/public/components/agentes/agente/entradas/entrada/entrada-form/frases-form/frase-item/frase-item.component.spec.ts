import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FraseItemComponent } from './frase-item.component';

describe('FraseItemComponent', () => {
  let component: FraseItemComponent;
  let fixture: ComponentFixture<FraseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
