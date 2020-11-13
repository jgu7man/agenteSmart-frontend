import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContextoDialogComponent } from './add-contexto-dialog.component';

describe('AddContextoDialogComponent', () => {
  let component: AddContextoDialogComponent;
  let fixture: ComponentFixture<AddContextoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContextoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
