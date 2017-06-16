import { Component } from '@angular/core'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  static data:any = {
    title: 'About',
    heading: '',
    meta: {description: 'Welcome to something'}
  }

}