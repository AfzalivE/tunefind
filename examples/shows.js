/**
 * Example: Shows
 * ==============
 *
 *
 */

var Client = require('../dist/tunefind').Client

var client = new Client({
	credentials: {
		username: process.env.TUNEFIND_USERNAME,
		password: process.env.TUNEFIND_PASSWORD
	}
})

// show a list of available shows
client.shows(function (err, shows) {
	if (err) {
		return console.log(err)
	}
	console.log(shows)
})

// lookup a series
client.show('heroes')
.then(function (show) {
	console.log(show)
})
.catch(console.log.bind(console))

// lookup a specific season of a show
client.season('How To Get Away With Murder', 1)
.then(function (season) {
	console.log(season)
})
.catch(console.log.bind(console))
