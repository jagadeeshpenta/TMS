import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Shared/auth/auth.service';
import { DBService } from './../../Shared/dbservice';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile = {};
  isEdit = false;
  editProfile;

  constructor(public auth: AuthService, private db: DBService) {
    // this.profile = this.auth.user;
    this.auth.checkUser().then(({ err, result }) => {
      if (result && result.profile) {
        this.profile = result.profile;
      }
    });
  }
  ngOnInit() {
    // this.renerSlider();
  }

  doEditProfile(): void {
    this.isEdit = true;
    this.editProfile = Object.create(this.auth.user);
  }
  handleSavechanges() {
    this.profile['firstname'] = this.editProfile.firstname;
    this.profile['lastname'] = this.editProfile.lastname;
    this.profile['dob'] = this.editProfile.dob;
    this.profile['address'] = this.editProfile.address;
    this.profile['phone'] = this.editProfile.phone;
    this.profile['email'] = this.editProfile.email;
    this.profile['emgCon'] = this.editProfile.emgCon;
    // // TODO: Save changes to DB using API call
    this.isEdit = false;
    this.db.updateEmployee({ profile: this.profile }).then(({ err, result }) => {

    });
  }




  // sliderWidth = 0;
  // slideWidth = 0;
  // slideCount = 5;
  // sliderLeft = 0;

  // touchStart = false;
  // touchX = 0;
  // oldX = 0;

  // renerSlider() {
  //   this.slideWidth = $('._slider-container').width() / 2;
  //   this.sliderWidth = this.slideCount * this.slideWidth;

  //   $('._slide').on('touchstart', (e) => {
  //     this.touchStart = true;
  //     this.touchX = e.touches[0].clientX;
  //     this.oldX = this.sliderLeft;
  //   });

  //   $(document).on('touchmove', (e) => {
  //     var dir = this.touchX - e.touches[0].clientX;
  //     if (dir > 0) {
  //       if (Math.abs(this.sliderLeft) <= (this.sliderWidth - (2 * this.slideWidth))) {
  //         this.sliderLeft = -(Math.abs(this.oldX) + dir);
  //       }
  //     } else {
  //       if (this.sliderLeft < 0) {
  //         this.sliderLeft = -(Math.abs(this.oldX) + dir);
  //       }
  //     }
  //   });

  //   $('._slide').on('touchend', (e) => {
  //     this.touchStart = false;
  //     this.touchX = 0;
  //     this.setSlide();
  //   });
  // }

  // setSlide() {
  //   console.log(this.sliderLeft, this.slideCount, this.slideWidth);
  //   var sliderIndex = Math.round(Math.abs(this.sliderLeft) / this.slideWidth);
  //   this.sliderLeft = - (sliderIndex * this.slideWidth);
  // }
}
