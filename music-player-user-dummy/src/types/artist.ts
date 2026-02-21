export interface Artist {
  _id: string;
  name: string;
  image: string;
  bio?: string;
  genres?: string[];
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}
