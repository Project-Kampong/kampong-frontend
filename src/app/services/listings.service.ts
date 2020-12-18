import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CreateListing, CreateListingUpdates, CreateListingMilestones, CreateListingHashtags,
  CreateListingFAQ, CreateListingLocation, CreateListingJobs, CreateListingComments, UpdateListingMilestones, 
  UpdateListingJobs, UpdateListing, UpdateListingFAQ } from "@app/interfaces/listing";
import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";
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

  constructor(private httpClient: HttpClient) {}

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
   * @param headers authOptionsWithoutContentType
   * @event POST
   */
  createListing(data: CreateListing, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/listings",
      data,
      headers
    )
  }

  /**
   * Creates an update for a particular listing
   * @param data Update Data
   * @param headers authOptionsWithoutContentType
   * @event POST
   */
  createListingUpdates(data: CreateListingUpdates, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/listing-updates",
      data,
      headers
    )
  }

  /**
   * Creates a milestone for a particular listing
   * @param data Milestone Data
   * @param headers authOptions
   * @event POST
   */
  createListingMilestones(data: CreateListingMilestones, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/milestones",
      data,
      headers
    );
  }

  /**
   * Creates a hashtag for a particular listing
   * @param data Hashtag Data
   * @param headers authOptions
   * @event POST
   */
  createListingHashtags(data: CreateListingHashtags, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/hashtags",
      data,
      headers
    );
  }

  /**
   * Creates an FAQ for a particular listing
   * @param data FAQ Data
   * @param headers authOptions
   * @event POST
   */
  createListingFAQ(data: CreateListingFAQ, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/faqs",
      data,
      headers
    );
  }

  /**
   * Creates/Connects a location for a particular listing
   * @param data Location Data
   * @param headers authOptions
   * @event POST
   */
  createListingLocation(data: CreateListingLocation, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/listing-locations",
      data,
      headers
    );
  }

  /**
   * Creates a job for a particular listing
   * @param data Job data
   * @param headers authOptions
   * @event POST
   */
  createListingJobs(data: CreateListingJobs, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/jobs",
      data,
      headers
    );
  }

  /**
   * Creates a comment for a particular listing
   * @param data Comment data
   * @param headers authOptions
   * @event POST
   */
  createListingComments(data: CreateListingComments, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/listing-comments",
      data,
      headers
    );
  }

  /**
   * Like a particular listing
   * @param listing_id Listing ID
   * @param headers authOptions
   * @event POST
   */
  likeListing(listing_id: string, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/likes",
      { listing_id: listing_id },
      headers
    );
  }

  /**
   * Unlike a particular listing
   * @param like_id Listing ID
   * @param headers authOptions
   * @event DELETE
   */
  unlikeListing(like_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/likes/" + like_id,
      headers
    );
  }


  /**
   * Update a particular listing
   * @param listing_id Listing ID
   * @param data Updated Listing Data
   * @param headers authOptionsWithoutContentType
   * @event PUT
   */
  updateListing(listing_id: string, data: UpdateListing, headers: OptionObject): Observable<API> {
    return this.httpClient.put<API>(
      this.url + "api/listings/" + listing_id,
      data,
      headers
    )
  }

  /**
   * Updates a particular milestone
   * @param milestone_id Milestone ID
   * @param data Updated Milestone Data
   * @param headers authOptions
   * @event PUT
   */
  updateMilestone(milestone_id: number, data: UpdateListingMilestones, headers: OptionObject): Observable<API> {
    return this.httpClient.put<API>(
      this.url + "api/milestones/" + milestone_id,
      data,
      headers
    );
  }

  /**
   * Updates a particular FAQ
   * @param faq_id FAQ ID
   * @param data Updated FAQ Data
   * @param headers authOptions
   * @event PUT
   */
  updateFAQ(faq_id: number, data: UpdateListingFAQ, headers: OptionObject): Observable<API> {
    return this.httpClient.put<API>(
      this.url + "api/faqs/" + faq_id,
      data,
      headers
    );
  }

  /**
   * Updates a particular Job
   * @param job_id Job ID
   * @param data Updated Job Data
   * @param headers authOptions
   * @event PUT
   */
  updateJobs(job_id: number, data: UpdateListingJobs, headers: OptionObject): Observable<API> {
    return this.httpClient.put<API>(
      this.url + "api/jobs/" + job_id,
      data,
      headers
    );
  }

  /**
   * Deletes a particular listing
   * @param listingId Listing ID
   * @param headers authOptions
   * @event DELETE
   */
  removeListing(listingId: string, headers: OptionObject): Observable<API> {
    return this.httpClient.put<API>(
      this.url + "api/listings/" + listingId + "/deactivate",
      {},
      headers
    );
  }

  /**
   * Deletes a particular milestone
   * @param milestone_id Milestone ID
   * @param headers authOptions
   * @event DELETE
   */
  removeMilestone(milestone_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/milestones/" + milestone_id,
      headers
    );
  }

  /**
   * Deletes a particular FAQ
   * @param faq_id FAQ ID
   * @param headers authOptions
   * @event DELETE
   */
  removeFAQ(faq_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/faqs/" + faq_id,
      headers
    );
  }

  /**
   * Deletes a particular hashtag
   * @param hashtag_id Hashtag ID
   * @param headers authOptions
   * @event DELETE 
   */
  removeHashtags(hashtag_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/hashtags/" + hashtag_id,
      headers
    );
  }

  /**
   * Deletes a particular location connected to the listing
   * @param listing_location_id Listing Location ID
   * @param headers authOptions
   * @event DELETE
   */
  removeListingLocation(listing_location_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/listing-locations/" + listing_location_id,
      headers
    );
  }

  /**
   * Deletes a particular job
   * @param listing_job_id Job ID
   * @param headers authOptions
   * @event DELETE
   */
  removeListingJobs(listing_job_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/jobs/" + listing_job_id,
      headers
    );
  }

  /**
   * Deletes a particular comment
   * @param comment_id Comment ID
   * @param headers authOptions
   * @event DELETE
   */
  removeListingComments(comment_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/listing-comments/" + comment_id,
      headers
    );
  }

  /**
   * Deletes a particular listing update
   * @param update_id Update ID
   * @param headers authOptions
   * @event DELETE
   */
  removeListingUpdates(update_id: number, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/listing-updates/" + update_id,
      headers
    );
  }

}
