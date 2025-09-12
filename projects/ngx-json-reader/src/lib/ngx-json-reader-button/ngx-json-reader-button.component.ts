import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ngx-json-reader-button',
  standalone: true,
  imports: [],
  templateUrl: './ngx-json-reader-button.component.html',
  styleUrl: './ngx-json-reader-button.component.scss'
})
export class NgxJsonReaderButtonComponent {

  label = input.required<string>();

  actionClick = output<boolean>();

  actionOnClick() {
    this.actionClick.emit(true);
  }
}
