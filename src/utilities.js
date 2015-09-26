/**
 * Utilities
 * =========
 *
 *
 */

/**
 * Apply common modifications for the title.
 * @param  {string} showId [description]
 */
export function formatId (showId) {
	return showId.replace(/\s+/g, '-').toLowerCase()
}

/**
 * [validateArguments description]
 */
export function validateArguments ([query, callback], mandatory = {}) {
	Object.keys(mandatory).forEach((key) => {
		const type = typeof mandatory[key]
		if (type !== 'string' && type !== 'number') {
			throw new Error(`Missing "${key}" parameter!`)
		}
	})
	if (typeof query === 'function') {
		callback = query
		query = null
	}
	return [query, callback]
}
