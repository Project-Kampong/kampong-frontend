import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Listing, DefaultListing } from "../interfaces/listing";

// Services Import
import { AuthService } from "../services/auth.service";
@Injectable({
  providedIn: "root",
})
export class ListingsService {
  constructor(
    private httpClient: HttpClient,
    private AuthService: AuthService
  ) {}

  // URL
  url = this.AuthService.URL;

  httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  options = {
    headers: this.httpHeaders,
  };

  // Variables
  ListingData: Listing[];
  tempListingData: Listing[] = [];
  FeaturedListingData: Listing[];

  // Eventemitter
  SkillsetsReturned = new EventEmitter<void>();

  // Static Data
  getAllSkillsets(page) {
    return this.httpClient.get(
      this.url + "api/skills?page=" + page,
      this.options
    );
  }

  getListings(page) {
    return this.httpClient.get(
      this.url + "api/listings?page=" + page,
      this.options
    );
  }

  getListingLoop(pagenum) {
    this.getListings(pagenum).subscribe((data) => {
      this.tempListingData.push(...data["data"]);
      console.log(this.tempListingData);
      this.FeaturedListingData = data["data"];
      if (data["pagination"]["next"] != null) {
        this.getListingLoop(data["pagination"]["next"]["page"]);
      } else {
        this.ListingData = this.tempListingData;
      }
    });
  }

  getSearchResult(keyword) {
    return this.httpClient.get(
      this.url +
        "api/listings/search-title?title=" +
        keyword +
        "&limit=25&sensitivity=50",
      this.options
    );
  }

  getPublicOwnedListings(userId) {
    return this.httpClient.get(
      this.url + "api/users/" + userId + "/listings/owner",
      this.options
    );
  }

  getSelectedListing(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId,
      this.options
    );
  }

  // Listing Likes
  getSelectedListingLikes(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/likes",
      this.options
    );
  }
  // Listing FAQ
  getSelectedListingFAQ(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/faqs",
      this.options
    );
  }

  // Listing Skills
  getSelectedListingSkills(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/listing-skills",
      this.options
    );
  }

  // Listing Stories
  getSelectedListingStories(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/stories",
      this.options
    );
  }

  // Listing Comments
  getSelectedListingComments(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/listing-comments",
      this.options
    );
  }

  // Updates
  getSelectedListingUpdates(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/listing-updates",
      this.options
    );
  }

  // Listing Milestones
  getSelectedListingMilestones(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/milestones",
      this.options
    );
  }

  // Listing Hashtags
  getSelectedListingHashtags(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/hashtags",
      this.options
    );
  }

  // Liked Listing - by User
  getLikedListing() {
    return this.httpClient.get(
      this.url + "api/users/" + this.AuthService.LoggedInUserID + "/likes",
      this.options
    );
  }

  // Write
  uploadFile(fd) {
    return this.httpClient.post(
      this.url + "api/file-upload",
      fd,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  createListing(data) {
    return this.httpClient.post(
      this.url + "api/listings",
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  UpdateListingStory(listingId, data) {
    return this.httpClient.put(
      this.url + "api/listings/" + listingId + "/stories",
      data,
      this.AuthService.AuthOptions
    );
  }

  createListingMilestones(data) {
    return this.httpClient.post(
      this.url + "api/milestones",
      data,
      this.AuthService.AuthOptions
    );
  }

  createListingHashtags(data) {
    return this.httpClient.post(
      this.url + "api/hashtags",
      data,
      this.AuthService.AuthOptions
    );
  }

  createListingSkills(data) {
    return this.httpClient.post(
      this.url + "api/skills",
      {
        skill: data,
      },
      this.AuthService.AuthOptions
    );
  }

  connectListingSkills(data) {
    return this.httpClient.post(
      this.url + "api/listing-skills",
      data,
      this.AuthService.AuthOptions
    );
  }

  createListingFAQ(data) {
    return this.httpClient.post(
      this.url + "api/faqs",
      data,
      this.AuthService.AuthOptions
    );
  }

  // Comments
  CreateListingComments(data) {
    return this.httpClient.post(
      this.url + "api/listing-comments",
      data,
      this.AuthService.AuthOptions
    );
  }

  // Updates
  CreateListingUpdates(data) {
    return this.httpClient.post(
      this.url + "api/listing-updates",
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  // Like A Listing
  LikedListing(listing_id) {
    return this.httpClient.post(
      this.url + "api/likes",
      { listing_id: listing_id },
      this.AuthService.AuthOptions
    );
  }

  UnLikedListing(like_id) {
    return this.httpClient.delete(
      this.url + "api/likes/" + like_id,
      this.AuthService.AuthOptions
    );
  }

  // UPDATE LISTING INFO SECTION
  updateListing(listingId, data) {
    return this.httpClient.put(
      this.url + "api/listings/" + listingId,
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  updateMilestone(milestone_id, data) {
    return this.httpClient.put(
      this.url + "api/milestones/" + milestone_id,
      data,
      this.AuthService.AuthOptions
    );
  }

  updateFAQ(faq_id, data) {
    return this.httpClient.put(
      this.url + "api/faqs/" + faq_id,
      data,
      this.AuthService.AuthOptions
    );
  }

  // Edit Listing
  // Delete
  removeListing(listingId) {
    return this.httpClient.put(
      this.url + "api/listings/" + listingId + "/deactivate",
      {},
      this.AuthService.AuthOptions
    );
  }

  removeMilestone(milestone_id) {
    return this.httpClient.delete(
      this.url + "api/milestones/" + milestone_id,
      this.AuthService.AuthOptions
    );
  }

  removeFAQ(faq_id) {
    return this.httpClient.delete(
      this.url + "api/faqs/" + faq_id,
      this.AuthService.AuthOptions
    );
  }

  removeHashtags(hashtag_id) {
    return this.httpClient.delete(
      this.url + "api/hashtags/" + hashtag_id,
      this.AuthService.AuthOptions
    );
  }

  removeListingSkills(listing_skill_id) {
    return this.httpClient.delete(
      this.url + "api/listing-skills/" + listing_skill_id,
      this.AuthService.AuthOptions
    );
  }

  removeListingComments(comment_id) {
    return this.httpClient.put(
      this.url + "api/listing-comments/" + comment_id + "/deactivate",
      {},
      this.AuthService.AuthOptions
    );
  }

  removeListingUpdates(update_id) {
    return this.httpClient.delete(
      this.url + "api/listing-updates/" + update_id,
      this.AuthService.AuthOptions
    );
  }
}
