// js/inMemoryWorkshop.js

let inMemoryWorkshop;

function init() {
    inMemoryWorkshop = [];
    return Promise.resolve();
}

function getWorkshopList() {
    return new Promise((resolve,) => {
        resolve(inMemoryWorkshop)
    })
}

function getWorkshopByName(name) {
    return new Promise((resolve, reject) => {
        if (!name) {
            reject(new Error("name parameter is required"))
        }
        const workshop = inMemoryWorkshop.find(workshop => workshop.name === name);
        if (workshop) {
            resolve(workshop);
        } else {
            reject(new Error("Workshop not found"));
        }
    })
}

function addWorkshop(name, description) {
    return new Promise((resolve, reject) => {
        if (!name) {
            reject(new Error("Workshop name required"))
        }
        if (!description) {
            reject(new Error("Workshop description required"))
        }
        inMemoryWorkshop.push({
            name,
            description
        })
        resolve()
    })
}

function removeWorkshopByName(name) {
    return new Promise((resolve, reject) => {
        reject(new Error("Not implemented"))
    })
}

function updateWorkshop(originalName, name, description) {
    return new Promise((resolve, reject) => {
        if (!originalName || !name || !description) {
            reject(new Error("All parameters are required"));
        }
        const index = inMemoryWorkshop.findIndex(workshop => workshop.name === originalName);
        if (index === -1) {
            reject(new Error("Workshop not found"));
        } else {
            inMemoryWorkshop[index] = { name, description };
            resolve();
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