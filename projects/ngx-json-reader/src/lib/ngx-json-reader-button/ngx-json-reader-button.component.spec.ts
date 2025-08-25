import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJsonReaderButtonComponent } from './ngx-json-reader-button.component';

describe('NgxNgxJsonReaderButtonComponent', () => {
  let component: NgxJsonReaderButtonComponent;
  let fixture: ComponentFixture<NgxJsonReaderButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxJsonReaderButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxJsonReaderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
