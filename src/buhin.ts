/**
 * Callback invoked when {@link Buhin.search} is called for a name that has no
 * registered data. The return value, if a string, is used as the lookup result;
 * returning `undefined` (or omitting the return) preserves the default behavior
 * of returning `""`.
 *
 * Useful for surfacing data inconsistencies that would otherwise be silently
 * dropped by the engine — for example, while building fonts from large dumps
 * where a missing buhin causes downstream `99:` instructions to disappear
 * without any warning.
 *
 * @example
 * ```ts
 * // Log warnings for every missing buhin while keeping the default fallback:
 * kage.kBuhin.onMissing = (name) => {
 *   console.warn(`Buhin "${name}" is missing`);
 * };
 *
 * // Or fail fast:
 * kage.kBuhin.onMissing = (name) => {
 *   throw new Error(`Buhin "${name}" is missing`);
 * };
 * ```
 */
export type BuhinMissingHandler = (name: string) => string | undefined;

/**
 * A key-value store that maps a glyph name to a string of KAGE data.
 */
export class Buhin {
	/** The object whose keys are glyph names and whose values are KAGE data. */
	protected hash: Record<string, string>;

	/**
	 * Optional callback invoked from {@link search} whenever a name has no
	 * registered data. See {@link BuhinMissingHandler} for usage.
	 *
	 * Defaults to `null` (silent fallback to `""`), preserving the original
	 * behavior so existing callers are unaffected.
	 */
	public onMissing: BuhinMissingHandler | null;

	constructor() {
		// initialize
		// no operation
		this.hash = {};
		this.onMissing = null;
	}

	// method
	/**
	 * Adds or updates an element with the given glyph name and KAGE data.
	 * @param name - The name of the glyph.
	 * @param data - The KAGE data.
	 */
	public set(name: string, data: string): void {
		this.hash[name] = data;
	}

	/**
	 * Searches the store for the given glyph name and returns the corresponding
	 * KAGE data.
	 *
	 * If the name is not registered and {@link onMissing} is set, the callback
	 * is invoked with the name. If the callback returns a string, that value is
	 * used as the lookup result; otherwise the default value `""` is returned.
	 *
	 * @param name - The name of the glyph to be looked up.
	 * @returns The KAGE data if found, the value returned by {@link onMissing}
	 * if it is a string, otherwise an empty string.
	 */
	public search(name: string): string {
		if (Object.prototype.hasOwnProperty.call(this.hash, name)) {
			return this.hash[name];
		}
		if (this.onMissing) {
			const replacement = this.onMissing(name);
			if (typeof replacement === "string") {
				return replacement;
			}
		}
		return ""; // no data
	}

	/**
	 * Adds or updates an element with the given glyph name and KAGE data.
	 * It is an alias for the {@link set} method.
	 * @param name - The name of the glyph.
	 * @param data - The KAGE data.
	 */
	public push(name: string, data: string): void {
		this.set(name, data);
	}
}

