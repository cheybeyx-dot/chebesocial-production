export interface Review {
  id: number;
  name: string;
  message: string;
  rating: number;
  approved: boolean;
}

export const reviewsData: Review[] = [
  {
    id: 1,
    name: "Michael A.",
    message: "Fast delivery and reliable service.",
    rating: 5,
    approved: true,
  },
];
