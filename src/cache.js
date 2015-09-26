/**
 * Cache
 * =====
 *
 *
 */

import Cacheman from 'cacheman'
import bytes from 'bytes'
import sizeof from 'object-sizeof'


/**
 *
 */
export default class Cache {
	constructor ({ size, ...options } = {}) {
		this.instance = new Cacheman('tunefind', {
			size: bytes.parse(size || Number.POSITIVE_INFINITY),
			count: 100,
			ttl: '24h',
			...options
		})
	}

	/**
	 * [description]
	 * @param  {string} key [description]
	 */
	get (key) {
		return new Promise((resolve, reject) => {
			this.instance.get(key, (err, value) => {
				if (err) {
					return reject(err)
				}
				if (!value) {
					return reject(new Error('Missing Value'))
				}
				return resolve(value)
			})
		})
	}

	/**
	 * [description]
	 * @param  {string} 			 key   [description]
	 * @param  {string|object} value [description]
	 */
	set (key, value, ttl = null) {
		return new Promise((resolve, reject) => {
			if (sizeof(this.instance._engine.client.values()) >= this.instance.options.size) {
				return this.instance.clear((err) => {
					if (err) {
						return reject(err)
					}
					this.instance.set(key, value, ttl, (err, value) => (err && reject(err)) || resolve(value))
				})
			}
			this.instance.set(key, value, ttl, (err, value) => (err && reject(err)) || resolve(value))
		})
	}
}
