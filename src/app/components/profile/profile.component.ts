import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Shared/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile = {};
  isEdit = false;
  editProfile;

  constructor(public auth: AuthService) {
    // this.profile = this.auth.user;
    this.auth.checkUser().then(({ err, result }) => {
      if (result && result.profile) {
        this.profile = result.profile;
      }
    });
  }
  ngOnInit() {

  }

  doEditProfile(): void {
    this.isEdit = true;
    this.editProfile = Object.create(this.auth.user);
  }
  handleSavechanges() {
    // this.profile["name"] = this.editProfile.name;
    // this.profile['dob'] = this.editProfile.dob;
    // this.profile['address'] = this.editProfile.address;
    // this.profile['phone'] = this.editProfile.phone;
    // this.profile['email'] = this.editProfile.email;
    // this.profile['emgCon'] = this.editProfile.emgCon;
    // // TODO: Save changes to DB using API call
    this.isEdit = false;
  }
}