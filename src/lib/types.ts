export interface SkillListing {
  id: string;
  name: string;
  initials: string;
  color: string;
  skill: string;
  location: string;
  tags: string[];
  price: string;
  priceNum: number;
  rating: string;
  reviews: number;
  isNew: boolean;
  category: string;
}

export interface ProductListing {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  sellerInitials: string;
  sellerColor: string;
  location: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  category: string;
  postedAt: string;
  isFeatured: boolean;
}

export interface User {
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}
