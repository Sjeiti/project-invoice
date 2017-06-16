import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {ModelService} from '../../model/model.service'
import {IClient} from '../../interface/client'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  static data:any = {
    title: 'Clients',
    heading: 'Clients',
    meta: {description: 'Foo is the bar of all qux'}
  }

  nameFilter = ''
  clients:IClient[]

  constructor(
      private router: Router,
      private modelService:ModelService
  ) {}

  ngOnInit() {
    this.clients = this.modelService.getClients()
  }

  onAddClient() {
    let client:IClient = this.modelService.addClient()
    this.router.navigate(['/client/'+client.nr])
  }

}
