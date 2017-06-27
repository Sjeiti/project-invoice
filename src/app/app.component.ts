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

  headingBase: string
  heading: string

  constructor(private router: Router, private headService: DOMHeadService) {
    this.headingBase = document.title
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let activatedRoute = router.routerState.root
        this.heading = this.getRouteData(activatedRoute, 'heading')
        const title = this.getRouteData(activatedRoute, 'title')
        headService.setTitle(this.headingBase+(title?' - '+title:''))
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
