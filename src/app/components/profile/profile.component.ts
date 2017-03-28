import { Component, OnInit } from '@angular/core';

export class User {
  name: string;
  dob: string;
  address: string;
  phone: number;
  email: string;
  emgCon: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User = {
    name: 'muralikrishna',
    dob: '1989-04-15',
    address: 'No: 6A, Ganesh Nager',
    phone: 8220285568,
    email: 'adeenadayalan@evoketechnologies.com',
    emgCon: 8939290345,
  };
  isEdit = false;
  editProfile;
  ngOnInit() {
  }
  // activeUser: User;
  // selectUser(user) {
  //   this.activeUser = user;
  //   console.log(this.activeUser);
  //

  doEditProfile(): void {
    this.isEdit = true;
    this.editProfile = Object.create(this.profile);
  }
  handleSavechanges() {
    console.log('chagnes ', this.editProfile, this.profile);
    this.profile.name = this.editProfile.name;
    this.profile.dob = this.editProfile.dob;
    this.profile.address = this.editProfile.address;
    this.profile.phone = this.editProfile.phone;
    this.profile.email = this.editProfile.email;
    this.profile.emgCon = this.editProfile.emgCon;
    // TODO: Save changes to DB using API call
    this.isEdit = false;
  }
}
