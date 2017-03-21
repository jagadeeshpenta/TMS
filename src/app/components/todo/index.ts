import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoComponent } from './todo.component';
import { TodoListComponent } from './todo-list.component';
import { TodoDetailsComponent } from './todo-detail.component';
import { TodoService } from './todo.service';
import { todorouting } from './routes';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        todorouting
    ],
    providers: [TodoService],
    declarations: [TodoComponent, TodoListComponent, TodoDetailsComponent],
    exports: [TodoComponent, TodoListComponent, TodoDetailsComponent],
    entryComponents: [TodoComponent, TodoListComponent, TodoDetailsComponent]
})
export class TodoModule { } 