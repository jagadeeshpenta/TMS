import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { TodoService } from "./todo.service";
import { TodoModal } from "../../Modals/todo.modal";

@Component({
    selector: '[todo-details]',
    templateUrl: './todo-detail.component.html'
})

export class TodoDetailsComponent {
    private _todoModal: TodoModal;
    constructor(private _route: ActivatedRoute, private _todoService: TodoService) {

    }

    ngOnInit() {
        if (this._route.snapshot.params['id']) {
            let id = parseInt(this._route.snapshot.params['id'], 10);
            this._todoModal = this._todoService.Todos[id - 1];
        } else {
            this._todoModal = this._todoService.Todos[1];
        }
    }
}