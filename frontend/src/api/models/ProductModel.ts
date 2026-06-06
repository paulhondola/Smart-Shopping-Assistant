export interface ProductOutput {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categories: string[];
}

export interface ProductInput {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryIds: number[];
}
