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
  srcUrls = [
    'https://stage-tools.kim-affiliates.com/assets/i18n/en.json',
    // 'https://stage-tools.kim-affiliates.com/assets/i18n/en.json',
    // 'https://stage-tools.kim-affiliates.com/assets/i18n/ua.json',
    // 'https://stage-tools.kim-affiliates.com/assets/i18n/ua.json',
  ];

  data = { user: { id: 1, name: 'Oleg' }, arr: [1,2,3] };
}
