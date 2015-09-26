/**
 * Client
 * ======
 *
 *
 */

import { stringify } from 'querystring'

import got from 'got'

import Cache from './cache'
import { formatId, validateArguments } from './utilities'


/**
 *
 */
export default class Client {
	constructor ({ credentials = {}, cache, ...options } = {}) {

		const username = credentials.username || process.env.TUNEFIND_USERNAME
		const password = credentials.password || process.env.TUNEFIND_PASSWORD

		this.defaultOptions = {
			json: true,
			auth: `${username}:${password}`
		}

		this.cache = new Cache(cache)

		this.baseUrl = 'https://www.tunefind.com/api/v1'
		this.country = options.country || 'US'
	}

	/**
	 * [request description]
	 * @param  {[type]}   path     [description]
	 * @param  {[type]}   query    [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	request (path, query, callback) {
		const options = {
			...this.defaultOptions,
			query: {
				country: this.country,
				...query
			}
		}
		const url = `${this.baseUrl}${path}`
		const key = `${url}?${stringify(options.query)}`

		return this.cache.get(key).catch((err) => {
			if (err.message !== 'Missing Value') {
				return err
			}
			return got(url, options).then(({ body }) => this.cache.set(key, body))
		})
		.then((value) => (callback && callback(null, value)) || value)
		.catch((err) => (callback && callback(err)) || err)
	}

	// official AP endpoints

	/**
	 * [shows description]
	 * @param  {object|undefined}   query    [description]
	 * @param  {function|undefined} callback [description]
	 */
	shows (query, callback) {
		[query, callback] = validateArguments([query, callback])
		return this.request('/show', query, callback).then((body) => body.shows)
	}

	/**
	 * [show description]
	 * @param  {string}   					showId   [description]
	 * @param  {object|undefined}   query    [description]
	 * @param  {function|undefined} callback [description]
	 */
	show (showId, query, callback) {
		[query, callback] = validateArguments([query, callback], { 'show-id': showId })
		return this.request(`/show/${formatId(showId)}`, query, callback)
	}

	/**
	 * [season description]
	 * @param  {string}   					showId       [description]
	 * @param  {string|number}   		seasonNumber [description]
	 * @param  {object|undefined}   query        [description]
	 * @param  {function|undefined} callback     [description]
	 */
	season (showId, seasonNumber, query, callback) {
		[query, callback] = validateArguments([query, callback], {
			'show-id': showId,
			'season-number': seasonNumber
		})
		return this.request(`/show/${formatId(showId)}/season-${seasonNumber}`, query, callback)
	}

	/**
	 * [episode description]
	 * @param  {string}   					showId       [description]
	 * @param  {string|number}   		seasonNumber [description]
	 * @param  {string|number}   		episodeId    [description]
	 * @param  {object|undefined}   query        [description]
	 * @param  {function|undefined} callback     [description]
	 */
	episode (showId, seasonNumber, identifier, query, callback) {
		[query, callback] = validateArguments([query, callback], {
			'show-id': showId,
			'season-number': seasonNumber,
			'episode-id': identifier
		})
		return this.season(showId, seasonNumber).then(({ episodes = [] }) => {
			var field = null
			var episodeId = null
			if (!isNaN(identifier)) {
				identifier = parseInt(identifier, 10)
			}
			switch (typeof identifier) {
				case 'number':
					field = 'number'
					identifier = identifier.toString()
					break
				case 'string':
					field = 'name'
					identifier = identifier.toLowerCase()
					break
				default:
					throw new Error('Invalid episode format!')
			}
			for (const { [field]: compare, id } of episodes) {
				if (compare.toLowerCase() === identifier) {
					episodeId = id
					break
				}
			}
			if (!episodeId) {
				const err = new Error(`Episode "${identifier}" Not Found!`)
				return (callback && callback(err)) || err
			}
			return this.request(`/show/${formatId(showId)}/season-${seasonNumber}/${episodeId}`, query, callback)
		})
	}

	/**
	 * [movies description]
	 * @param  {object|undefined}   query    [description]
	 * @param  {function|undefined} callback [description]
	 */
	movies (query, callback) {
		[query, callback] = validateArguments([query, callback])
		return this.request('/movie', query, callback).then((body) => body.movies)
	}

	/**
	 * [movie description]
	 * @param  {string}   					movieId  [description]
	 * @param  {object|undefined}   query    [description]
	 * @param  {function|undefined} callback [description]
	 */
	movie (movieId, query, callback) {
		[query, callback] = validateArguments([query, callback], { 'movie-id': movieId })
		return this.request(`/movie/${formatId(movieId)}`, query, callback)
	}

	/**
	 * [artists description]
	 * @param  {object|undefined}   query    [description]
	 * @param  {function|undefined} callback [description]
	 */
	artists (query, callback) {
		[query, callback] = validateArguments([query, callback])
		return this.request('/artist', query, callback).then((body) => body.artists)
	}

	/**
	 * [artist description]
	 * @param  {string}   					artistId [description]
	 * @param  {object|undefined}   query    [description]
	 * @param  {function|undefined} callback [description]
	 */
	artist (artistId, query, callback) {
		[query, callback] = validateArguments([query, callback], { 'artist-id': artistId })
		return this.request(`/artist/${formatId(artistId)}`, query, callback)
	}
}
