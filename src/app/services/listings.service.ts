import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEvent } from "@angular/common/http";
import { CreateListing, CreateListingUpdates, CreateListingMilestones, CreateListingHashtags,
  CreateListingFAQ, CreateListingLocation, CreateListingJobs, CreateListingComments, UpdateListingMilestones, 
  UpdateListingHashtags, UpdateListingJobs, UpdateListing } from "@app/interfaces/listing";
import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";
import { AuthService } from "@app/services/auth.service";
import { environment } from "src/environments/environment";

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: "root",
})
export class ListingsService {
  
  private url: string = environment.apiUrl;
  private options: OptionObject = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private httpClient: HttpClient, private AuthService: AuthService) {}

  /**
   * Get all listings that are checked featured
   * @event GET
   */
  getFeaturedListings(): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/featured",
      this.options
    );
  }

  /**
   * Get data of all listings
   * @event GET
   */
  getListings(): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings",
      this.options
    );
  }

  /**
   * Get listing associated with the input ID 
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListing(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId,
      this.options
    );
  }

  /**
   * Get listings based on the input keywords
   * @param input Input keywords
   * @event GET
   */
  getSearchResult(input: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/search?keyword=" + input,
      this.options
    );
  }

  /**
   * Get all the likes for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingLikes(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/likes",
      this.options
    );
  }

  /**
   * Get all the FAQs for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingFAQ(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/faqs",
      this.options
    );
  }

  /**
   * Get all the comments for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingComments(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/listing-comments",
      this.options
    );
  }

  /**
   * Get all the replies for a particular parent comment
   * @param commentId Comment ID
   * @event GET
   */
  getSelectedCommentChildren(commentId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listing-comments/" + commentId + "/children",
      this.options
    );
  }

  /**
   * Get all updates for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingUpdates(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/listing-updates",
      this.options
    );
  }

  /**
   * Get all milestones for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingMilestones(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/milestones",
      this.options
    );
  }

  /**
   * Get all hashtags for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingHashtags(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/hashtags",
      this.options
    );
  }

  /**
   * Get all locations for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingLocations(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/listing-locations",
      this.options
    );
  }

  /**
   * Get all jobs for a particular listing
   * @param listingId Listing ID
   * @event GET
   */
  getSelectedListingJobs(listingId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/listings/" + listingId + "/jobs",
      this.options
    );
  }

  /**
   * Creates Listing
   * @param data Listing Data
   * @event POST
   */
  createListing(data: CreateListing): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/listings",
      data,
      this.AuthService.OnlyAuthHttpHeaders
    )
  }

  /**
   * Creates an update for a particular listing
   * @param data Update Data
   * @event POST
   */
  createListingUpdates(data: CreateListingUpdates): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/listing-updates",
      data,
      this.AuthService.OnlyAuthHttpHeaders
    )
  }

  /**
   * Creates a milestone for a particular listing
   * @param data Milestone Data
   * @event POST
   */
  createListingMilestones(data: CreateListingMilestones): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/milestones",
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Creates a hashtag for a particular listing
   * @param data Hashtag Data
   * @event POST
   */
  createListingHashtags(data: CreateListingHashtags): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/hashtags",
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Creates an FAQ for a particular listing
   * @param data FAQ Data
   * @event POST
   */
  createListingFAQ(data: CreateListingFAQ): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/faqs",
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Creates/Connects a location for a particular listing
   * @param data Location Data
   * @event POST
   */
  createListingLocation(data: CreateListingLocation): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/listing-locations",
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Creates a job for a particular listing
   * @param data Job data
   * @event POST
   */
  createListingJobs(data: CreateListingJobs): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/jobs",
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Creates a comment for a particular listing
   * @param data Comment data
   * @event POST
   */
  createListingComments(data: CreateListingComments): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/listing-comments",
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Like a particular listing
   * @param listing_id Listing ID
   * @event POST
   */
  likeListing(listing_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/likes",
      { listing_id: listing_id },
      this.AuthService.AuthOptions
    );
  }

  /**
   * Unlike a particular listing
   * @param like_id Listing ID
   * @event DELETE
   */
  unlikeListing(like_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/likes/" + like_id,
      this.AuthService.AuthOptions
    );
  }


  /**
   * Update a particular listing
   * @param listing_id Listing ID
   * @param data Updated Listing Data
   * @event PUT
   */
  updateListing(listing_id: string, data: UpdateListing) {
    return this.httpClient.put<API>(
      this.url + "api/listings/" + listing_id,
      data,
      this.AuthService.OnlyAuthHttpHeaders
    )
  }

  /**
   * Updates a particular milestone
   * @param milestone_id Milestone ID
   * @param data Updated Milestone Data
   * @event PUT
   */
  updateMilestone(milestone_id: string, data: UpdateListingMilestones): Observable<HttpEvent<API>> {
    return this.httpClient.put<API>(
      this.url + "api/milestones/" + milestone_id,
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Updates a particular FAQ
   * @param faq_id FAQ ID
   * @param data Updated FAQ Data
   * @event PUT
   */
  updateFAQ(faq_id: string, data: UpdateListingHashtags) {
    return this.httpClient.put<API>(
      this.url + "api/faqs/" + faq_id,
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Updates a particular Job
   * @param job_id Job ID
   * @param data Updated Job Data
   * @event PUT
   */
  updateJobs(job_id: string, data: UpdateListingJobs): Observable<HttpEvent<API>> {
    return this.httpClient.put<API>(
      this.url + "api/jobs/" + job_id,
      data,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular listing
   * @param listingId Listing ID
   * @event DELETE
   */
  removeListing(listingId: string): Observable<HttpEvent<API>> {
    return this.httpClient.put<API>(
      this.url + "api/listings/" + listingId + "/deactivate",
      {},
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular milestone
   * @param milestone_id Milestone ID
   * @event DELETE
   */
  removeMilestone(milestone_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/milestones/" + milestone_id,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular FAQ
   * @param faq_id FAQ ID
   * @event DELETE
   */
  removeFAQ(faq_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/faqs/" + faq_id,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular hashtag
   * @param hashtag_id Hashtag ID
   * @event DELETE 
   */
  removeHashtags(hashtag_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/hashtags/" + hashtag_id,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular location connected to the listing
   * @param listing_location_id Listing Location ID
   * @event DELETE
   */
  removeListingLocation(listing_location_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/listing-locations/" + listing_location_id,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular job
   * @param listing_job_id Job ID
   * @event DELETE
   */
  removeListingJobs(listing_job_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/jobs/" + listing_job_id,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular comment
   * @param comment_id Comment ID
   * @event DELETE
   */
  removeListingComments(comment_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/listing-comments/" + comment_id,
      this.AuthService.AuthOptions
    );
  }

  /**
   * Deletes a particular listing update
   * @param update_id Update ID
   * @event DELETE
   */
  removeListingUpdates(update_id: string): Observable<HttpEvent<API>> {
    return this.httpClient.delete<API>(
      this.url + "api/listing-updates/" + update_id,
      this.AuthService.AuthOptions
    );
  }

}
