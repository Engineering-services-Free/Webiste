import type { ApiResponse } from "./api.typings";

export interface ContactSocialMedia {
  platform: string;
  url: string;
}

export interface ContactLocation {
  mapUrl: string;
}

export interface Contact {
  id: string;
  contactNumber1: string;
  contactNumber2?: string;
  whatsappNumber: string;
  email: string;
  socialMedia: ContactSocialMedia[];
  location: ContactLocation;
  createdAt?: string;
  updatedAt?: string;
}

export type GetContactResponse = ApiResponse<Contact | null>;
