
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { FusionStoryWrapperComponent } from './wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FusionStoryWrapperComponent],
  template: `<div class="component-wrapper">
  <!--FusionUI component story-->
  <fusion-story-wrapper></fusion-story-wrapper>
  <!--FusionUI component story-->
</div>`,
})
export class AppComponent {}

bootstrapApplication(AppComponent).catch((err) => console.error(err));
