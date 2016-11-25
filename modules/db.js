const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const {MONGOLAB_URI} = process.env
const dbCollection = 'shortener';

const getNextSequence = (db, name) =>
	db.collection('counters').findAndModify(
		{_id: name},{},
		{ $inc: { seq: 1 } },
		{new:true}
	)


const newUrl = (url, db, callback) => {
	const collection = db.collection(dbCollection)

	collection.findOne({ url: url })
		.then(val => {
			if(val) {
				db.close()
				callback(null, val._id)
			} else {
				getNextSequence(db, dbCollection)
					.then(val => {
						collection.insertOne(
							{
								_id: val.value.seq,
								url: url
							}
						).then(val =>{
							db.close()
							callback(null, val.insertedId)
						})
					})
			}
		})
}

const findHash = (hash, db, callback) => {
	const collection = db.collection(dbCollection)
	collection.findOne(
		{ _id: hash },
		(err, url) => {
			db.close()
			callback(err, url)
		}
	)
}

const db = ({url, hash}, callback) => MongoClient.connect(MONGOLAB_URI, (err, db) => {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	if (url) newUrl(url, db, (err, url) => callback(err, url))
	if (hash) findHash(hash, db, (err, url) => callback(err, url))
});

module.exports = db