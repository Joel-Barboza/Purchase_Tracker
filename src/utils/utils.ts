import { TextElement } from '@react-native-ml-kit/text-recognition';
import {
  Line,
  ReceiptProcessResult,
  CATEGORIES,
  CategoryName,
} from './types';
import {
  NitroSQLiteConnection,
} from 'react-native-nitro-sqlite';
import { addPurchase, getAllPurchases } from '../db/purchase';
import {
  addProduct,
  findProductByCode,
  getProductCategoryById,
  updateProductCategory,
  updateProductPrice,
} from '../db/product';
import {
  addPurchaseItem,
  getPurchaseItemsByPurchaseId,
} from '../db/purchaseItems';
import { addProductPrice } from '../db/productPrice';

export const getMinTopFromLine = (line: TextElement[]): number | undefined => {
  if (line.length <= 0) return;
  const tops: number[] = [];

  for (const word of line) {
    if (word.frame) {
      tops.push(word.frame.top);
    }
  }

  const minY = Math.min(...tops);
  return minY;
};

export const getMaxBottomFromLine = (
  line: TextElement[],
): number | undefined => {
  if (line.length <= 0) return;
  const bottoms: number[] = [];

  for (const word of line) {
    if (word.frame) {
      bottoms.push(word.frame.top + word.frame.height);
    }
  }

  const maxY = Math.max(...bottoms);
  return maxY;
};

export const findLeftAndWidthFromSection = (
  section: Line[],
): { left: number; width: number } | undefined => {
  let left = Infinity;
  let right = -Infinity;

  for (const line of section) {
    if (line.words.length === 0) continue;

    const first = line.words[0];
    const last = line.words[line.words.length - 1];

    if (!first.frame || !last.frame) continue;

    left = Math.min(left, first.frame.left);

    const lineRight = last.frame.left + last.frame.width;
    right = Math.max(right, lineRight);
  }

  if (!isFinite(left) || !isFinite(right)) {
    return undefined;
  }

  return {
    left,
    width: right - left,
  };
};

export const persistPurchaseData = async (
  db: NitroSQLiteConnection,
  processedResult: ReceiptProcessResult,
): Promise<void> => {
  const { productDetails, image_uri, serialized_ocr, store }: ReceiptProcessResult =
    processedResult;
  const purchaseId: number | undefined = await addPurchase(
    db,
    image_uri,
    serialized_ocr,
    store,
  );
  if (!purchaseId) return;

  for (const details of productDetails) {
    if (
      !details.product.prodCode ||
      !details.product.unitPrice ||
      !details.product.quantity ||
      !details.product.totalPrice ||
      !details.product.category
    )
      continue;
    const productRow = await findProductByCode(db, details.product.prodCode);

    let productId: number;
    if (productRow != null) {
      productId = Number(productRow.id);
      await updateProductPrice(
        db,
        details.product.prodCode,
        details.product.unitPrice,
      );
      await updateProductCategory(
        db,
        details.product.prodCode,
        details.product.category,
      );
    } else {
      const insertId = await addProduct(db, details.product);
      if (!insertId) continue;
      productId = insertId;
    }
    await addProductPrice(db, productId, details.product.unitPrice);
    await addPurchaseItem(
      db,
      purchaseId,
      productId,
      details.product.unitPrice,
      details.product.quantity,
      details.product.totalPrice,
    );
  }
  const tableList = ['product', 'product_price', 'purchase', 'purchase_items'];
  setTimeout(async () => {
    console.log('reading tables');
    for (const tableName of tableList) {
      try {
        const result = await db.executeAsync(`SELECT * FROM ${tableName};`);
        const rows = [];
        if (!result.rows) return;
        for (let i = 0; i < result.rows.length; i++) {
          rows.push(result.rows.item(i));
        }
        console.log(`📋 Contents of ${tableName}:`, rows);
      } catch (error) {
        console.error(`❌ Error reading ${tableName}:`, error);
      }
    }
  }, 3000);
};

export const getCategoryInsights = async (
  db: NitroSQLiteConnection,
): Promise<Record<CategoryName, number>> => {
  // Initialize totals
  const totals: Record<CategoryName, number> = Object.fromEntries(
    CATEGORIES.map(cat => [cat, 0]),
  ) as Record<CategoryName, number>;

  const purchaseList = await getAllPurchases(db);
  if (!purchaseList) return totals;

  for (const purchase of purchaseList) {
    if (typeof purchase.id !== 'number') continue;

    const purchaseItems = await getPurchaseItemsByPurchaseId(db, purchase.id);
    if (!purchaseItems) continue;

    for (const item of purchaseItems) {
      const category = await getProductCategoryById(db, item.product_id);
      if (!category) continue;

      totals[category] += item.total_price;
    }
  }

  return totals;
};

