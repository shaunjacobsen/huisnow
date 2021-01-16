export interface PropertyData {
  propertyId: string;
  type: string;
  title: string;
  postcode: string;
  municipality: string;
  neighborhood: string;
  agent: string;
  price: number;
  surface: number;
  images: string[];
  url: string;
  dateAvailable: string;
  coords: number[];
  constructionYear: number;
}
