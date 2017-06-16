import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
// pages
import {HomeComponent} from './page/home/home.component'
import {Error404Component} from './page/error404/error404.component'
import {OverviewComponent} from './page/overview/overview.component'
import {QuarterComponent} from './page/quarter/quarter.component'
import {ClientsComponent} from './page/clients/clients.component'
import {ClientComponent} from './page/client/client.component'
import {ProjectComponent} from './page/project/project.component'
import {InvoiceComponent} from './page/invoice/invoice.component'
import {SettingsComponent} from './page/settings/settings.component'
import {DataComponent} from './page/data/data.component'
import {CopyComponent} from './page/copy/copy.component'
import {AboutComponent} from './page/about/about.component'

const appRoutes:Routes = [
  {path: '', component: HomeComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'overview/quarter', component: QuarterComponent},
  {path: 'overview/quarter/:year', component: QuarterComponent},
  {path: 'overview/year', component: OverviewComponent},
  {path: 'overview/year/:year', component: OverviewComponent},
  {path: 'clients', component: ClientsComponent},
  {path: 'client/:clientNr', component: ClientComponent},
  {path: 'client/:clientNr/:projectNr', component: ProjectComponent},
  {path: 'client/:clientNr/:projectNr/quotation', component: InvoiceComponent},
  {path: 'client/:clientNr/:projectNr/invoice', component: InvoiceComponent},
  {path: 'client/:clientNr/:projectNr/reminder/:reminderNr', component: InvoiceComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'data', component: DataComponent},
  {path: 'copy', component: CopyComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', component: Error404Component}
]
// apply data if present
appRoutes.forEach(route=> {
  let component:any = route.component
  component.data&&(route.data = component.data)
})
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}