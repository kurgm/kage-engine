/** @enum Enum of the supported fonts. */
export const KShotai = {
	/**
	 * Mincho-style font (明朝体).
	 * @see {@link Mincho} for the corresponding font class.
	 */
	kMincho: 0,
	/**
	 * Gothic-style font (ゴシック体).
	 * @see {@link Gothic} for the corresponding font class.
	 */
	kGothic: 1,
} as const;

export type KShotai = typeof KShotai[keyof typeof KShotai];
