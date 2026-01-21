import { TextElement } from '@react-native-ml-kit/text-recognition';

export type ImageProcessingStackParamList = {
  CameraScreen: undefined;
  ImageReviewScreen: {
    imageProps: ImageProps;
  };
  ProductReviewScreen: {
    productList: Product[];
    image_uri: string;
    serialized_ocr: string;
    store: Store;
  };
};

export type ImageProps = {
  imageUri: string;
  height: number;
  width: number;
  source: 'camera' | 'gallery';
};

export const STORES = ['walmart', 'maxipali', 'pali'] as const;

export type StoreName = (typeof STORES)[number];

export type Store = {
  name: StoreName | string | undefined;
};

export type Line = {
  words: TextElement[];
  text: string;
};

export type NormalizedOcr = {
  lines: Line[];
  store: Store;
};

export type OcrInfo = {
  lines: Line[];
  store: Store;
  image_uri: string | null;
  serialized_ocr: string | null;
};

export const CATEGORIES = [
  'food',
  'whims',
  'home',
  'cleaning',
  'self care',
  'other',
];

export type CategoryName = (typeof CATEGORIES)[number];

export type ProductSection = {
  lines: Line[];
  frame: {
    top: number;
    left: number;
    heigth: number;
    width: number;
  };
};

export type Product = {
  name: string | undefined;
  prodCode: string | undefined;
  quantity: number | undefined;
  unitPrice: number | undefined;
  totalPrice: number | undefined;
  soldByKg: 0 | 1 | undefined; // false
  category: CategoryName | undefined;
};

export type ReceiptProcessResult = {
  products: Product[];
  image_uri: string | null;
  serialized_ocr: string | null;
  store: Store;
};

