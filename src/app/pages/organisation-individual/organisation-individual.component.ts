import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrganisationsService } from '@app/services/organisations.service';
import { SnackbarService } from '@app/services/snackbar.service';

// Interface
import { Organisation, OrganisationBanner } from '@app/interfaces/organisation';
import { Subscription } from 'rxjs';
import { ListingIndividual } from '@app/interfaces/listing';

declare var $: any;

@Component({
  selector: 'app-organisation-individual',
  templateUrl: './organisation-individual.component.html',
  styleUrls: ['./organisation-individual.component.scss'],
})
export class OrganisationIndividualComponent implements OnInit, OnDestroy {
  organisationId: string = '';
  subscriptions: Subscription[] = [];
  organisationData: Organisation = <Organisation>{};
  listings: ListingIndividual[] = [];
  currentDate = new Date();
  organisationBanner: OrganisationBanner = <OrganisationBanner>{};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private organisationsService: OrganisationsService,
    public snackbarService: SnackbarService,
  ) {}

  // Updates
  ngOnInit() {
    window.scroll(0, 0);
    this.organisationId = this.route.snapshot.params['id'];
    this.subscriptions.push(
      this.organisationsService.getSelectedOrganisation(this.organisationId).subscribe(
        (res) => {
          this.organisationData = res['data'];
          this.organisationBanner = {
            banner_photo: this.organisationData.banner_photo,
            profile_photo: this.organisationData.profile_photo,
            name: this.organisationData.name,
            about: this.organisationData.about,
            address: this.organisationData.address,
            facebook_link: this.organisationData.facebook_link,
            instagram_link: this.organisationData.instagram_link,
            twitter_link: this.organisationData.twitter_link,
            website_url: this.organisationData.website_url,
          };
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.generic_error.error, false);
          this.router.navigate(['/home/']);
        },
      ),
    );

    this.subscriptions.push(
      this.organisationsService.getAllListingsForAnOrganisation(this.organisationId).subscribe(
        (res) => {
          this.listings = res['data'];
        },
        (err) => {
          console.log(err);
        },
      ),
    );

    // UI Components
    $('.navigation-tabs li').on('click', function () {
      $('.navigation-tabs li').removeClass('active');
      $(this).addClass('active');
    });
    this.tabs_selected('story');
  }

  // Updates
  getDiffInTime(time) {
    const newTime = new Date(time);
    var diff = this.currentDate.getTime() - newTime.getTime();
    diff /= 1000;

    var hh = Math.floor(diff / (60 * 60));
    var dd = Math.floor(diff / (60 * 60 * 24));
    var mm = Math.floor(diff / (60 * 60 * 24 * 30));
    var yy = Math.floor(diff / (60 * 60 * 24 * 30 * 12));
    if (hh > 24) {
      // retun day
      if (dd > 30) {
        if (mm > 12) {
          if (yy > 1) {
            return yy + ' Years ago';
          } else {
            return yy + ' Year ago';
          }
        } else {
          if (mm > 1) {
            return mm + ' Months ago';
          } else {
            return mm + ' Month ago';
          }
        }
      } else {
        if (dd > 1) {
          return dd + ' Days ago';
        } else {
          return dd + ' Day ago';
        }
      }
    } else if (hh < 1) {
      return 'Less than 1 Hour ago';
    } else {
      if (hh > 1) {
        return hh + ' Hours ago';
      } else {
        return hh + ' Hour ago';
      }
    }
  }

  // UI Components

  UpdateSlicked = false;
  initiateSlick() {
    if (!$('.update-image-slider').hasClass('slick-initialized')) {
      $('.update-image-slider').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    } else {
      $('.update-image-slider').slick('unslick');
      this.initiateSlick();
    }
  }

  tabs_selected(selected) {
    $('.tabs-content').hide();
    $('#' + selected).show();
    if (selected == 'updates') {
      this.initiateSlick();
    }
  }

  selectedProfile(user_id) {
    this.router.navigate(['/profile/' + user_id]);
  }

  togglePopup() {
    // Toggle popup
    $('.popup-bg').toggleClass('active');
    $('.popup-box').toggleClass('active');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
