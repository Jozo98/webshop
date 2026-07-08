export interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  description: string;
  _links?: {
    self: { href: string };
    [key: string]: any;
  };
}