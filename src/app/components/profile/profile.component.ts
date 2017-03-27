import { Component, OnInit } from '@angular/core';

export class User{
  id: number;
  name: string;
  username: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  edited: boolean = true;
  users: User[] = [
        {id: 25, name: 'Chris', username: 'sevilayha'}
    ];
  constructor() { }

  ngOnInit() {
  }
  activeUser: User;
    selectUser(user) {
        this.activeUser = user;
        console.log(this.activeUser);
    }
    

}
