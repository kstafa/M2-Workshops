// js/mongoWorkshop.js

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongo:27017';
const dbName = 'workshopDatabase';
const COLLECTION_NAME = "workshops"
let db;

function init() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.error("Failed to connect to MongoDB:", err);
                return reject(err)
            }
            console.log("Connected successfully to MongoDB server");
            db = client.db(dbName);
            resolve();
        });
    })
}

function getWorkshopList() {
    return new Promise((resolve, reject) => {
        const collection = db.collection(COLLECTION_NAME);
        collection.find({}).toArray(function (err, workshops) {
            if (err) {
                return reject(err);
            }
            return resolve(workshops)
        })
    })
}

function getWorkshopByName(name) {
    return new Promise((resolve, reject) => {
        if (!name) {
            reject(new Error("name parameter is required"))
        }
        const collection = db.collection(COLLECTION_NAME);
        collection.findOne({ name: name }, function (err, workshop) {
            if (err) {
                return reject(err);
            }
            if (workshop) {
                return resolve(workshop);
            } else {
                return reject(new Error("Workshop not found"));
            }
        });
    })
}

function addWorkshop(name, description) {
    if (!name) {
        return Promise.reject(new Error("Workshop name required"));
    }
    if (!description) {
        return Promise.reject(new Error("Workshop description required"));
    }
    const collection = db.collection(COLLECTION_NAME);
    return collection.insert({
        name, description
    }).then(() => { return })
}

function removeWorkshopByName(name) {
    const collection = db.collection(COLLECTION_NAME);
    return collection.deleteOne({ name: name })
        .then(result => {
            if (result.deletedCount === 0) {
                throw new Error("Atelier non trouvé");
            }
        });
}

function updateWorkshop(originalName, name, description) {
    if (!originalName) {
        return Promise.reject(new Error("Original workshop name required"));
    }
    if (!name) {
        return Promise.reject(new Error("New workshop name required"));
    }
    if (!description) {
        return Promise.reject(new Error("Workshop description required"));
    }

    const collection = db.collection(COLLECTION_NAME);
    return collection.updateOne(
        { name: originalName },
        { $set: { name, description } }
    ).then(result => {
        if (result.modifiedCount === 0) {
            throw new Error("Workshop not found");
        }
    });
}

module.exports = {
    init,
    getWorkshopList,
    getWorkshopByName,
    addWorkshop,
    removeWorkshopByName,
    updateWorkshop
}