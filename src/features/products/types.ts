export interface Product {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  brand: string;
  category: string;
  images: string[];
  price: number;
  discountedPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface Banner {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  image: string;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaLink: string;
  bgColor: string;
}
