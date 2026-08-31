export type EditorialSlot = "editorial-1" | "editorial-2";

export interface Editorial {
  _id: string;
  slot: EditorialSlot;
  image1Url: string;
  image2Url?: string;
  heading: string;
  subheading?: string;
  discoverHref?: string;
}

export interface UpdateEditorialRequest {
  image1Url: string;
  image2Url?: string;
  heading: string;
  subheading?: string;
  discoverHref?: string;
}