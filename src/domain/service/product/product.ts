export interface Product {
  id: number;
  productName: string;
  productDesc: string;
  deletedAt: Date | null;
}


export interface ISellerAddProductIn {
  productName: string;
  productDesc: string;
  price: number;
  count: number;
  sellerId: number;
}

export interface IAddProductOut {
  productName: string;
  productDesc: string;
}

export interface IAddSellerProductOut {
  sellerId: number;
  productId: number;
  price: number;
  count: number;
}
