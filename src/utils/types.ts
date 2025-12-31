import { TextElement } from "@react-native-ml-kit/text-recognition";

export const STORES = ['walmart', 'maxipali', 'pali'] as const;

export type StoreName = typeof STORES[number];

export type Store = {
  name: StoreName | undefined;
};

export type NormalizedOcr = {
  lines: TextElement[][],
  store: Store
}

export type ProductSection = {
  lines: TextElement[][],
  frame: {
    top: number,
    left: number,
    heigth: number,
    width: number
  }
}

export type ClassifiedProductLines = {
  lines: {
    line: TextElement[], type: 'info' | 'product'
  }[]
}