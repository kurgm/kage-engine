/**
 * A key-value store that maps a glyph name to a string of KAGE data.
 */
export class Buhin {
	/** The object whose keys are glyph names and whose values are KAGE data. */
	protected hash: Record<string, string>;

	constructor() {
		// initialize
		// no operation
		this.hash = {};
	}

	// method
	/**
	 * Adds or updates an element with a given glyph name and KAGE data.
	 * @param name The name of the glyph.
	 * @param data The KAGE data.
	 */
	public set(name: string, data: string): void {
		this.hash[name] = data;
	}

	/**
	 * Search the store for a specified glyph name and returns the corresponding
	 * KAGE data.
	 * @param name The name of the glyph to be looked up.
	 * @returns The KAGE data if found, or an empty string if not found.
	 */
	public search(name: string): string {
		if (this.hash[name]) {
			return this.hash[name];
		}
		return ""; // no data
	}

	/**
	 * Adds or updates and element with a given glyph name and KAGE data.
	 * It is an alias of {@link set} method.
	 * @param name The name of the glyph.
	 * @param data The KAGE data.
	 */
	public push(name: string, data: string): void {
		this.set(name, data);
	}
}

