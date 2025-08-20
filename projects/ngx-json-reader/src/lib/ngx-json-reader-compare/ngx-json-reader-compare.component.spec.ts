import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJsonReaderCompareComponent } from './ngx-json-reader-compare.component';

describe('NgxJsonReaderComponent', () => {
  let component: NgxJsonReaderCompareComponent;
  let fixture: ComponentFixture<NgxJsonReaderCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxJsonReaderCompareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxJsonReaderCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
