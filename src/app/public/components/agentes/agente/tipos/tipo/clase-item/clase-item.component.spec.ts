import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseItemComponent } from './clase-item.component';

describe('ClaseItemComponent', () => {
  let component: ClaseItemComponent;
  let fixture: ComponentFixture<ClaseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
