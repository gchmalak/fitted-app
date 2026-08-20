export interface CarouselSlideDTO {
  _id: string;
  imageUrl: string;
  ctaLink: string;
  ctaText: string;
  bgColor?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}