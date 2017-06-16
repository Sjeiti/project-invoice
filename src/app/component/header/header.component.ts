import {Component} from '@angular/core'
import {Router, NavigationEnd} from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  public active = 'active'
  public dropped = false

  constructor(private router: Router){
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.dropped = false
      }
    })
  }

}
