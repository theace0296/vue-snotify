/**
 * Generates random id
 */
export function uuid(): number {
  return Math.floor(Math.random() * (Date.now() - 1)) + 1;
}

/**
 * Simple is object check.
 */
export function isObject(item: unknown): boolean {
  if (item && typeof item === 'object' && !Array.isArray(item) && item !== null) return true;
  return false;
}

/**
 * Deep merge objects.
 */

export function mergeDeep(...sources: (object | undefined)[]) {
  const target = {};
  if (!sources.length) {
    return target;
  }

  while (sources.length > 0) {
    const source = sources.shift();
    if (isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          target[key] = mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  }
  return target;
}
