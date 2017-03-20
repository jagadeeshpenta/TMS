import {Component, NgZone, Input, Output, EventEmitter} from "@angular/core";
import {KeysPipe} from "../../Pipes/keys.pipe";

/**
 * <div class="container" 
        grid-view [gvOptions]="gvOptions" 
        (editEvent)="_editCar($event)"
        (deleteEvent) = "_deleteCar($event)"
    ></div>

 *  ngOnInit() {
    this._carsService.$cars.subscribe((updatedCars) => {
      this.zone.run(() => {
        this.gvOptions = {
          data: updatedCars,
          showActions: true,
          actionsToShow: ['EDIT', 'DELETE'],
          columnDefs: [
            { displayName: 'Id', fieldName: 'id' },
            { displayName: 'Car Name', fieldName: 'name' },
            { displayName: 'Car Type', fieldName: 'type' },
            { displayName: 'Car Company', fieldName: 'company' }
          ]
        };
      });
    });
  } 

 */

@Component({
    selector: '[grid-view]',
    templateUrl: 'Components/GridView/grid-view.tpl.html'
})

export class GridView {
    constructor(private zone: NgZone) { }

    @Input() gvOptions: any = {
        data: [],
        columnDefs: [],
        showActions: false,
        actionsToShow: ['VIEW', 'EDIT', 'DELETE']
    };

    @Output() viewEvent = new EventEmitter();
    @Output() editEvent = new EventEmitter();
    @Output() deleteEvent = new EventEmitter();

    private _view(evt: any, row: any) {
        this.viewEvent.next({ event: evt, modal: row });
    }

    private _edit(evt: any, row: any) {
        this.editEvent.next({ event: evt, modal: row });
    }

    private _delete(evt: any, row: any) {
        this.deleteEvent.next({ event: evt, modal: row });
    }
}
