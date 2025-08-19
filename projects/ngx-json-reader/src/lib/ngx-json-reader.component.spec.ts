import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJsonReaderComponent } from './ngx-json-reader.component';

describe('NgxJsonReaderComponent', () => {
  let component: NgxJsonReaderComponent;
  let fixture: ComponentFixture<NgxJsonReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxJsonReaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxJsonReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
