import {Component, OnInit, OnDestroy} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {IClient} from '../../interface/client'
import {Saveable} from '../../abstract/saveable'
import {ModelService} from '../../model/model.service'
import {modelAction, modelAble} from '../../signals'

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})

export class ClientComponent extends Saveable implements OnInit, OnDestroy {

  static data:any = {
    title: 'Client',
    heading: 'Client',
    meta: {description: 'Foo is the bar of all qux'}
  }
  private subscription:any
  public client:IClient
  public clientNr:number

  constructor(
    protected modelService:ModelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(modelService, modelAble.SAVE|modelAble.DELETE)
    modelAction.add(state=>{
      state===modelAction.DELETE&&this.onDelete()
    })
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscription = this.route.params.subscribe(params => {
       this.clientNr = params['clientNr']<<0
    this.client = this.setModel(this.modelService.getClientByNr(this.clientNr)) as IClient
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    this.subscription.unsubscribe()
  }

  onDelete() {
    let isDeleted:boolean = super.onDelete(this.modelService.removeClient.bind(this.modelService))
    isDeleted&&this.router.navigate(['/clients'])
    return isDeleted
  }

  onAddProject() {
    let project = this.modelService.addProject(this.clientNr)
    this.router.navigate([project.uri])
  }

  protected cloneModel():IClient {
    this.client = super.cloneModel() as IClient
    return this.client
  }

}
