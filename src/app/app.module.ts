import {DOCUMENT, BrowserModule, Title} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'

// modules
// main
import {AppComponent} from './app.component'
// service
import {DOMHeadService} from './service/dom.head.service'
import {RestService} from './service/rest.service'
import {ModelService} from './model/model.service'
import {LocalisationService} from './service/localisation.service'
import {InterpolationService} from './service/interpolation.service'
// component
import {FooterComponent} from './component/footer/footer.component'
import {HeaderComponent} from './component/header/header.component'
import {SaveableButtonsComponent} from './component/saveable-buttons/saveable-buttons.component'
import {CurrencyComponent} from './component/currency/currency.component'
import {FoldableDefinitionComponent} from './component/foldable-definition/foldable-definition.component'
import {LangComponent} from './component/lang/lang.component'
// routing
import {AppRoutingModule} from './app-routing.module'
// pages
import {HomeComponent} from './page/home/home.component'
import {Error404Component} from './page/error404/error404.component'
import {OverviewComponent} from './page/overview/overview.component'
import {QuarterComponent} from './page/quarter/quarter.component'
import {ClientsComponent} from './page/clients/clients.component'
import {ClientComponent} from './page/client/client.component'
import {ProjectComponent} from './page/project/project.component'
import {InvoiceComponent} from './page/invoice/invoice.component'
import {PrintInvoiceComponent} from './print/invoice/invoice.component'
import {SettingsComponent} from './page/settings/settings.component'
import {LayoutComponent} from './page/layout/layout.component'
import {DataComponent} from './page/data/data.component'
import {CopyComponent} from './page/copy/copy.component'
import {AboutComponent} from './page/about/about.component'
// filters
import {ObjectPipe} from './filter/object.pipe'
import {TotalPipe} from './filter/total.pipe'
import {NamePipe} from './filter/name.pipe'
import {LatestClientPipe} from './filter/latest-client.pipe'
import {CurrencyFormat} from './filter/currency-format.pipe'
import {SafeHtmlPipe} from './filter/safe-html.pipe'
import {ArraySortPipe} from './filter/sort.pipe'
import {ArrayFilterPipe} from './filter/filter.pipe'
// directives
import {InterpolationUIComponent} from './component/interpolationUI/interpolationui.component'
import {ExplainDirective} from './directive/explain.directive'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    //
    HomeComponent,
    Error404Component,
    OverviewComponent,
    QuarterComponent,
    ClientsComponent,
    ClientComponent,
    ProjectComponent,
    SettingsComponent,
    LayoutComponent,
    DataComponent,
    CopyComponent,
    AboutComponent,
    //
    ObjectPipe,
    TotalPipe,
    NamePipe,
    SafeHtmlPipe,
    ArraySortPipe,
    ArrayFilterPipe,
    LatestClientPipe,
    CurrencyFormat,
    //
    SaveableButtonsComponent,
    InvoiceComponent,
    PrintInvoiceComponent,
    CurrencyComponent,
    FoldableDefinitionComponent,
    InterpolationUIComponent,
    ExplainDirective,
    LangComponent
  ],
  providers: [
    Title,
    DOMHeadService,
    RestService,
    ModelService,
    InterpolationService,
    LocalisationService,
    {provide: DOCUMENT, useValue: document}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
