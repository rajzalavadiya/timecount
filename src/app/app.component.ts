import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimeDisplayComponent } from './time-display/time-display.component';
import { TimeActivityComponent } from './time-activity/time-activity.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimeDisplayComponent,RouterOutlet,TimeActivityComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pc-monitoring-app';

}
