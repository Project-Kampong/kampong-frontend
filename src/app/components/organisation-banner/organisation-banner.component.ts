import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { OrganisationBanner } from '@app/interfaces/organisation';
declare var $: any;

@Component({
  selector: 'org-banner',
  templateUrl: './organisation-banner.component.html',
  styleUrls: ['./organisation-banner.component.scss'],
})
export class OrgBannerComponent implements OnInit, OnChanges {
  @Input() bannerData: OrganisationBanner;
  constructor() {}

  ngOnInit() {
    console.log(this.bannerData);
  }

  ngOnChanges() {
    console.log(this.bannerData);
  }
}
