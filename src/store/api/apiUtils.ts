/**
 * API Utilities
 * Helper functions for API transformations
 */

/**
 * Convert snake_case object to camelCase
 * Use this if backend returns snake_case but TypeScript expects camelCase
 *
 * @example
 * const snakeObj = { full_name: "John", user_id: 1 };
 * const camelObj = toCamelCase(snakeObj);
 * // Result: { fullName: "John", userId: 1 }
 */
export function toCamelCase<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T;
  }

  if (typeof obj === 'object') {
    const camelObj: Record<string, unknown> = {};

    Object.keys(obj as Record<string, unknown>).forEach((key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelObj[camelKey] = toCamelCase((obj as Record<string, unknown>)[key]);
    });

    return camelObj as T;
  }

  return obj as T;
}

/**
 * Convert camelCase object to snake_case
 * Use this if backend expects snake_case but TypeScript uses camelCase
 *
 * @example
 * const camelObj = { fullName: "John", userId: 1 };
 * const snakeObj = toSnakeCase(camelObj);
 * // Result: { full_name: "John", user_id: 1 }
 */
export function toSnakeCase<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as T;
  }

  if (typeof obj === 'object') {
    const snakeObj: Record<string, unknown> = {};

    Object.keys(obj as Record<string, unknown>).forEach((key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      snakeObj[snakeKey] = toSnakeCase((obj as Record<string, unknown>)[key]);
    });

    return snakeObj as T;
  }

  return obj as T;
}
