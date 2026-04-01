// ── Darwin Marketplace Data Layer ──

export type Category =
  | 'Textbooks'
  | 'Electronics'
  | 'Furniture'
  | 'Clothing'
  | 'Tickets'
  | 'Notes & Study Material'
  | 'Sports & Fitness'
  | 'Other';

export type Condition = 'New' | 'Like New' | 'Good' | 'Fair';

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: Category;
  condition: Condition;
  description: string;
  image: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    campus: string;
  };
  createdAt: string;
  saved: boolean;
}

export const categories: Category[] = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Tickets',
  'Notes & Study Material',
  'Sports & Fitness',
  'Other',
];

import React from 'react';
import { Book, Laptop, Armchair, Shirt, Ticket, NotebookText, Dumbbell, Package } from 'lucide-react';

export const categoryIcons: Record<Category, React.ReactNode> = {
  'Textbooks': <Book size={48} strokeWidth={1.5} />,
  'Electronics': <Laptop size={48} strokeWidth={1.5} />,
  'Furniture': <Armchair size={48} strokeWidth={1.5} />,
  'Clothing': <Shirt size={48} strokeWidth={1.5} />,
  'Tickets': <Ticket size={48} strokeWidth={1.5} />,
  'Notes & Study Material': <NotebookText size={48} strokeWidth={1.5} />,
  'Sports & Fitness': <Dumbbell size={48} strokeWidth={1.5} />,
  'Other': <Package size={48} strokeWidth={1.5} />,
};

export const sampleListings: Listing[] = [
  {
    id: '1',
    title: 'Organic Chemistry (8th Edition) - McMurry',
    price: 45,
    category: 'Textbooks',
    condition: 'Good',
    description: 'Used for one semester. Some highlighting but all pages intact. Includes solution manual.',
    image: '/images/textbook.jpg',
    seller: { name: 'Sarah K.', avatar: '/avatars/1.jpg', rating: 4.8, campus: 'Main Campus' },
    createdAt: '2025-01-10',
    saved: false,
  },
  {
    id: '2',
    title: 'MacBook Air M2 — Space Gray',
    price: 780,
    category: 'Electronics',
    condition: 'Like New',
    description: 'Barely used MacBook Air M2 with 256GB SSD and 8GB RAM. Comes with original charger and box.',
    image: '/images/macbook.jpg',
    seller: { name: 'James R.', avatar: '/avatars/2.jpg', rating: 4.9, campus: 'North Campus' },
    createdAt: '2025-01-12',
    saved: true,
  },
  {
    id: '3',
    title: 'IKEA MARKUS Office Chair — Black',
    price: 85,
    category: 'Furniture',
    condition: 'Good',
    description: 'Ergonomic office chair. Perfect for long study sessions. Minor wear on armrests.',
    image: '/images/chair.jpg',
    seller: { name: 'Priya M.', avatar: '/avatars/3.jpg', rating: 4.6, campus: 'Main Campus' },
    createdAt: '2025-01-08',
    saved: false,
  },
  {
    id: '4',
    title: 'TI-84 Plus CE Graphing Calculator',
    price: 65,
    category: 'Electronics',
    condition: 'Like New',
    description: 'Used for 2 semesters of calculus. Works perfectly, comes with charging cable.',
    image: '/images/calculator.jpg',
    seller: { name: 'Alex W.', avatar: '/avatars/4.jpg', rating: 5.0, campus: 'South Campus' },
    createdAt: '2025-01-14',
    saved: false,
  },
  {
    id: '5',
    title: 'Nike Dri-FIT Running Shorts — M',
    price: 15,
    category: 'Clothing',
    condition: 'New',
    description: 'Brand new with tags. Size Medium. Black color. Never worn — wrong size.',
    image: '/images/shorts.jpg',
    seller: { name: 'Marcus T.', avatar: '/avatars/5.jpg', rating: 4.7, campus: 'Main Campus' },
    createdAt: '2025-01-15',
    saved: false,
  },
  {
    id: '6',
    title: 'Concert Tickets — Campus Fest 2025 (x2)',
    price: 30,
    category: 'Tickets',
    condition: 'New',
    description: 'Two GA tickets for the spring campus music festival. Can\'t attend anymore.',
    image: '/images/tickets.jpg',
    seller: { name: 'Zara L.', avatar: '/avatars/6.jpg', rating: 4.5, campus: 'Main Campus' },
    createdAt: '2025-01-16',
    saved: true,
  },
  {
    id: '7',
    title: 'CS201 Complete Study Notes — PDF',
    price: 10,
    category: 'Notes & Study Material',
    condition: 'New',
    description: 'Comprehensive notes covering all lectures. Includes diagrams and code examples. Got an A.',
    image: '/images/notes.jpg',
    seller: { name: 'Liam H.', avatar: '/avatars/7.jpg', rating: 4.9, campus: 'Tech Campus' },
    createdAt: '2025-01-13',
    saved: false,
  },
  {
    id: '8',
    title: 'Yoga Mat — Extra Thick, Purple',
    price: 18,
    category: 'Sports & Fitness',
    condition: 'Good',
    description: '6mm thick yoga mat. Used a few times. Great for dorm workouts.',
    image: '/images/yogamat.jpg',
    seller: { name: 'Emma D.', avatar: '/avatars/8.jpg', rating: 4.3, campus: 'West Campus' },
    createdAt: '2025-01-11',
    saved: false,
  },
];

export const matrixChars = 'アイウエオカキクケコサシスセソΩΔΣΦΨβγδθλπABCDEF0123456789'.split('');
