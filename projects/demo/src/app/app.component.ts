import { Component } from '@angular/core';
import { NgxJsonReaderComponent } from 'ngx-json-reader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxJsonReaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
