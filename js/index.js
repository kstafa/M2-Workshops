// js/index.js


const express = require('express')
const app = express()
const path = require("path")
const ejs = require('ejs')
var bodyParser = require('body-parser')
//const repository = require('./inMemoryWorkshop');
const repository = require("./mongoWorkshop");

repository.init().then(() => {

    app.use(bodyParser.urlencoded({ extended: false }))

    // set the view engine to ejs
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', '/ejs'));
    app.use(express.static(path.join(__dirname, '..', 'css')));


    app.get('/', function (req, res) {
        repository.getWorkshopList()
            .then(workshops => {
                res.render("index", {
                    workshops: workshops
                })
            })
    })

    app.get('/workshop', function (req, res) {
        console.log("get")
        res.render('workshop')
    })

    app.post('/workshop', function (req, res) {
        const name = req.body.name
        const description = req.body.description
        repository.addWorkshop(name, description).then(() => {
            repository.getWorkshopList()
                .then(workshops => {
                    res.render("index", {
                        workshops: workshops
                    })
                })
        })
            .catch(e => res.send(e.message))
    })

    app.get('/workshop/:name', function (req, res) {
        const workshopName = req.params.name
        repository.getWorkshopByName(workshopName)
            .then(workshop => {
                res.render('ejs/workshop', workshop)
            })
            .catch(e => ejs.send(e.message))
    })

    app.get('/workshop/:name/edit', function (req, res) {
        const workshopName = req.params.name;
        console.log("Attempting to edit workshop:", workshopName);
        repository.getWorkshopByName(workshopName)
            .then(workshop => {
                if (workshop) {
                    console.log("Workshop found:", workshop);
                    res.render('edit-workshop', { workshop: workshop });
                } else {
                    console.log("Workshop not found:", workshopName);
                    res.status(404).send('Workshop not found');
                }
            })
            .catch(e => {
                console.error("Error when getting workshop:", e);
                res.status(500).send(e.message)
            });
    });



    app.post('/remove-workshop', function (req, res) {
        const workshopName = req.body.name;
        repository.removeWorkshopByName(workshopName)
            .then(() => {
                res.redirect('/');
            })
            .catch(e => res.status(500).send(e.message));
    });

    app.post('/update-workshop', function (req, res) {
        const originalName = req.body.originalName;
        const name = req.body.name;
        const description = req.body.description;
        repository.updateWorkshop(originalName, name, description)
            .then(() => {
                res.redirect('/');
            })
            .catch(e => res.status(500).send(e.message));
    });

    app.listen(3000, function () {
        console.log('Workshop app listening on port 3000!')
    })

})

