import { TextElement } from "@react-native-ml-kit/text-recognition";

export const getMinTopFromLine = (
  line: TextElement[]
): number | undefined => {
  if (line.length <= 0) return;
  const tops: number[] = [];

  for (const word of line) {
    if (word.frame) {
      tops.push(word.frame.top);
    }
  }

  const minY = Math.min(...tops);
  return minY;
}

export const getMaxBottomFromLine = (
  line: TextElement[]
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
}

export const findLeftAndWidthFromSection = (
  section: TextElement[][]
): { left: number; width: number } | undefined => {

  let left = Infinity;
  let right = -Infinity;

  for (const line of section) {
    if (line.length === 0) continue;

    const first = line[0];
    const last = line[line.length - 1];

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
