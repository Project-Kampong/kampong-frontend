export interface Organisation {
  organisation_id: string;
  name: string;
  organisation_type: string;
  about: string;
  website_url: string;
  phone: string;
  email: string;
  address: string;
  owned_by: string;
  locations: string[];
  story: string,
  facebook_link: string,
  twitter_link: string,
  instagram_link: string,
  banner_photo: string,
  profile_photo: string,
  additional_photos: string[],
  is_verified: boolean,
  created_on: string,
  deleted_on: string,
}

export interface OrganisationBanner {
  banner_photo: string,
  profile_photo: string,
  name: string,
  about: string,
  address: string,
  facebook_link: string,
  instagram_link: string,
  twitter_link: string,
  website_url: string,
}

export interface CreateOrganisation {
  name: string,
  organisation_type: string,
  about: string,
  website_url?: string,
  phone?: string,
  email: string,
  story?: string,
  address?: string,
  locations?: string[],
  facebook_link?: string,
  twitter_link?: string,
  instagram_link?: string,
}

export interface UpdateOrganisation {
  name: string,
  organisation_type: string,
  about: string,
  website_url?: string,
  phone?: string,
  email: string,
  story?: string,
  address?: string,
  locations?: string[],
  facebook_link?: string,
  twitter_link?: string,
  instagram_link?: string,
}

export interface Programmes {
  organisation_id : string,
  title: string,
  about: string,
  media_url: string[],
}

export interface CreateProgrammes {
  title: string,
  about: string,
  media_url: string[],
}
