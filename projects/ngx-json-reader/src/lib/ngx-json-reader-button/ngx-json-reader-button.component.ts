import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-json-reader-button',
  standalone: true,
  imports: [],
  templateUrl: './ngx-json-reader-button.component.html',
  styleUrl: './ngx-json-reader-button.component.scss'
})
export class NgxJsonReaderButtonComponent {

  @Input() label!: string;

  @Output() actionClick = new EventEmitter<boolean>();

  actionOnClick() {
    this.actionClick.emit(true);
  }
}
