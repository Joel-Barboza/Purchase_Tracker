import { TextElement } from "@react-native-ml-kit/text-recognition";

export const STORES = ['walmart', 'maxipali', 'pali'] as const;

export type StoreName = typeof STORES[number];

export type Store = {
  name: StoreName | undefined;
};

export type Line = {
  words: TextElement[],
  text: string
}

export type NormalizedOcr = {
  lines: Line[],
  store: Store
}

export type ProductSection = {
  lines: Line[],
  frame: {
    top: number,
    left: number,
    heigth: number,
    width: number
  }
}

export type Product = {
  name: string | undefined,
  prodCode: string | undefined,
  quantity: number | undefined,
  unitPrice: number | undefined,
  totalPrice: number | undefined,
  soldByKg: 0 | 1 | undefined, // false
}