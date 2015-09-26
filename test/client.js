/**
 * Example
 * =======
 *
 *
 */

import { expect } from 'chai'
import { Client } from '../dist/tunefind'


describe('client', () => {

	describe('movies', () => {

		it('returns a list of available movies', (done) => {
			const client = new Client()
			client.movies().then((movies) => {
				expect(movies).to.be.an.instanceof(Array)
				done()
			}).catch(console.error.bind(console))

		})

	})

})
