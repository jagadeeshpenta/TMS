import { Component, OnInit } from '@angular/core';

export class User {
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

  users: User[] = [
    { id: 25, name: 'Chris', username: 'sevilayha' }
  ];


  profile = {
    firstname: 'muralikrishna',
    lastname: 't',
    dob: '1989-04-15'
  };
  isEdit = false;
  editProfile;
  ngOnInit() {
  }
  activeUser: User;
  selectUser(user) {
    this.activeUser = user;
    console.log(this.activeUser);
  }
  eventHandler(event) {
    if (event.keyCode === 13) {
      console.log("Element")
      this.activeUser.name = event.target.value;
      console.log(this.activeUser);
    }
    if (event.keyCode == 27) {
      console.log("Hello world")
    }
  }

  doEditProfile():void {
    this.isEdit = true;
    this.editProfile = Object.create(this.profile);
  }
  handleSavechanges() {
    console.log('chagnes ', this.editProfile, this.profile);
    this.profile.firstname = this.editProfile.firstname;
    this.profile.dob = this.editProfile.dob;
    //TODO: Save changes to DB using API call
    this.isEdit = false;
  }
}
