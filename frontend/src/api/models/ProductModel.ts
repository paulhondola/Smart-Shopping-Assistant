export interface ProductGetDto {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categories: string[];
}

export interface ProductCreateDto {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryIds: number[];
}

export interface ProductUpdateDto {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryIds: number[];
}
