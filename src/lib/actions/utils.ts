/**
 * Generates a unique identifier string with an optional prefix.
 *
 * The unique ID is composed of the specified prefix, the current timestamp (in
 * base 36), and a random alphanumeric string segment.
 *
 * @param prefix - A string to prefix the generated ID. Defaults to `'tint'`.
 * @returns A unique identifier string in the format
 *   `${prefix}-${timestamp}-${random}`.
 */
export function generateUniqueId(prefix: string = 'tint'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `${prefix}-${timestamp}-${random}`
}
