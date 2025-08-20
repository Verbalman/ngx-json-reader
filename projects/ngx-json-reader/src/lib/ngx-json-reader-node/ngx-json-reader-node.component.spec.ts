import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJsonReaderNodeComponent } from './ngx-json-reader-node.component';

describe('NgxJsonReaderNodeComponent', () => {
  let component: NgxJsonReaderNodeComponent;
  let fixture: ComponentFixture<NgxJsonReaderNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxJsonReaderNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxJsonReaderNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
