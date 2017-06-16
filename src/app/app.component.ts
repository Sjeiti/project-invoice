import {Component} from '@angular/core'
import {Router, NavigationEnd} from '@angular/router'
import {DOMHeadService} from './service/dom.head.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']/*,
   encapsulation: ViewEncapsulation.None*/
})

export class AppComponent {

  heading: string

  constructor(private router: Router, private headService: DOMHeadService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let activatedRoute = router.routerState.root
        this.heading = this.getRouteData(activatedRoute, 'heading')
        headService.setTitle('Voice - '+this.getRouteData(activatedRoute, 'title'))
        headService.setMetas(this.getRouteData(activatedRoute, 'meta'))
        //
        window.scrollTo(0, 0)
      }
    })
  }

  /**
   * Get data properties from activatedRoute
   * @param {ActivatedRoute} activatedRoute
   * @param {string} name
   * @returns {string}
   */
  getRouteData(activatedRoute, name) {
    let firstChild = activatedRoute.snapshot.firstChild
        , data = firstChild && firstChild.data
    return data && data[name] || null
  }
}
