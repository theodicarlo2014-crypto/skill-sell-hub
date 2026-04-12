import { SkillListing, ProductListing } from './types';

export const skillListings: SkillListing[] = [
  { id: 's1', name: 'Maria Gonzalez', initials: 'MG', color: '#7c6aff', skill: 'Spanish Tutoring', location: 'Brooklyn, NY · 0.5 mi', tags: ['Conversational', 'Beginner', 'Advanced'], price: '$35/hr', priceNum: 35, rating: '4.9', reviews: 47, isNew: false, category: 'Tutoring' },
  { id: 's2', name: 'James Chen', initials: 'JC', color: '#22d3a0', skill: 'Web Design & UI/UX', location: 'Manhattan, NY · 1.2 mi', tags: ['Figma', 'React', 'Branding'], price: '$75/hr', priceNum: 75, rating: '5.0', reviews: 31, isNew: true, category: 'Design' },
  { id: 's3', name: 'Lisa Park', initials: 'LP', color: '#f59e0b', skill: 'Piano Lessons', location: 'Queens, NY · 2.1 mi', tags: ['All levels', 'Classical', 'Jazz'], price: '$50/hr', priceNum: 50, rating: '4.8', reviews: 22, isNew: false, category: 'Music' },
  { id: 's4', name: 'Kevin Okafor', initials: 'KO', color: '#ef4444', skill: 'Personal Training', location: 'Harlem, NY · 1.8 mi', tags: ['HIIT', 'Strength', 'Online'], price: '$60/hr', priceNum: 60, rating: '4.9', reviews: 58, isNew: false, category: 'Fitness' },
  { id: 's5', name: 'Sarah Williams', initials: 'SW', color: '#06b6d4', skill: 'Home Plumbing Repair', location: 'Bronx, NY · 3.5 mi', tags: ['Emergency', 'Install', 'Repair'], price: '$45/hr', priceNum: 45, rating: '4.7', reviews: 19, isNew: true, category: 'Home repair' },
  { id: 's6', name: 'David Kim', initials: 'DK', color: '#8b5cf6', skill: 'Math & Science Tutoring', location: 'Brooklyn, NY · 0.8 mi', tags: ['SAT Prep', 'Calculus', 'Physics'], price: '$40/hr', priceNum: 40, rating: '5.0', reviews: 63, isNew: false, category: 'Tutoring' },
];

export const productListings: ProductListing[] = [
  { id: 'p1', title: 'Vintage Leather Messenger Bag', description: 'Handcrafted genuine leather bag, barely used. Great for work or travel.', price: 85, image: '🎒', seller: 'Alex Rivera', sellerInitials: 'AR', sellerColor: '#7c6aff', location: 'Brooklyn, NY', condition: 'Like New', category: 'Fashion', postedAt: '2 hours ago', isFeatured: true },
  { id: 'p2', title: 'Sony WH-1000XM4 Headphones', description: 'Noise-cancelling headphones in excellent condition. Includes original box and cable.', price: 180, image: '🎧', seller: 'Tina Nguyen', sellerInitials: 'TN', sellerColor: '#22d3a0', location: 'Manhattan, NY', condition: 'Like New', category: 'Electronics', postedAt: '5 hours ago', isFeatured: true },
  { id: 'p3', title: 'Mountain Bike — Trek Marlin 7', description: '2023 model, ridden only a few times. 29" wheels, hydraulic disc brakes.', price: 650, image: '🚴', seller: 'Marcus Johnson', sellerInitials: 'MJ', sellerColor: '#f59e0b', location: 'Queens, NY', condition: 'Like New', category: 'Sports', postedAt: '1 day ago', isFeatured: false },
  { id: 'p4', title: 'IKEA Standing Desk — BEKANT', description: 'Electric sit/stand desk, white top, 63x31". Moving sale.', price: 250, image: '🪑', seller: 'Emma Clarke', sellerInitials: 'EC', sellerColor: '#ef4444', location: 'Harlem, NY', condition: 'Good', category: 'Furniture', postedAt: '3 hours ago', isFeatured: false },
  { id: 'p5', title: 'Canon EOS R50 Camera Kit', description: 'Mirrorless camera with 18-45mm lens. Perfect for beginners. Includes bag.', price: 520, image: '📷', seller: 'Ryan Patel', sellerInitials: 'RP', sellerColor: '#06b6d4', location: 'Bronx, NY', condition: 'New', category: 'Electronics', postedAt: '30 min ago', isFeatured: true },
  { id: 'p6', title: 'Nike Air Max 90 — Size 10', description: 'Brand new, never worn. Triple white colorway.', price: 95, image: '👟', seller: 'Jade Williams', sellerInitials: 'JW', sellerColor: '#8b5cf6', location: 'Brooklyn, NY', condition: 'New', category: 'Fashion', postedAt: '6 hours ago', isFeatured: false },
  { id: 'p7', title: 'PS5 Slim + 2 Controllers', description: 'Disc edition, bought 3 months ago. Comes with extra controller and 2 games.', price: 420, image: '🎮', seller: 'Chris Kim', sellerInitials: 'CK', sellerColor: '#22d3a0', location: 'Manhattan, NY', condition: 'Like New', category: 'Electronics', postedAt: '2 days ago', isFeatured: false },
  { id: 'p8', title: 'Handmade Pottery Set (6 pcs)', description: 'Beautiful ceramic bowls and plates. Unique glaze patterns, food-safe.', price: 120, image: '🍶', seller: 'Sofia Moreno', sellerInitials: 'SM', sellerColor: '#f59e0b', location: 'Queens, NY', condition: 'New', category: 'Home', postedAt: '1 day ago', isFeatured: true },
];

export const skillCategories = ['All', 'Tutoring', 'Design', 'Home repair', 'Fitness', 'Music', 'Tech help', 'Cooking', 'Pet care'];
export const productCategories = ['All', 'Electronics', 'Fashion', 'Furniture', 'Sports', 'Home', 'Vehicles', 'Books'];
