// const config = require("dotevn").config();

const express = require('express');
const mongoose = require('mongoose');

const { listContacts, getContactById, addContact, removeContact,updateContact } = require('./contacts');
const app = express()
host = "127.0.0.1";
port = 4000;

mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true,
useNewUrlParser: true,
useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { })





app.use((req, res, next) => {
    if (req.header('Content-type') === 'application/json') {
        req.on('data', data => {
            req.body = JSON.parse(data.toString());
            next()
        })
    } else {
        next()
    }
})

app.get('/contacts', async (req, res) => {
    res.status(200).type('text/plain');
    console.log(await listContacts())
    res.send(await listContacts())
})

app.get('/contacts/:contactId', async (req, res) => {

    if ((await listContacts()).some(el => el.id == (Number(req.params.contactId)))) {
        res.status(200).send((await getContactById(Number(req.params.contactId))))
    }

    else res.status(404).send(JSON.stringify({ message: 'Not fount' }))




})

app.post('/contacts',
    (req, res, next) => {
        console.log(req.body)
        if (!('name', 'email', 'phone' in req.body)) {
            res.status(400);
            return res.send({ "message": "Missing required name field" })
        }next()
        
    },
    async (req, res) => {
        const { name, email, phone } = req.body;
        
        const addCont = await addContact(name, email, phone)
        res.status(201)
        res.send(JSON.stringify(addCont))
        


    }
)

app.delete('/contacts/:contactId',
    async (req, res, next) => {
        if ((await listContacts())
            .some(el => el.id == (Number(req.params.contactId))) != true) {
            res.status(404)
            res.send(JSON.stringify({ "message": "Contact not found" }))
        } next()
    },
    async (req, res) => {
        const idCont = (Number(req.params.contactId));
        const newlist = await removeContact(idCont);

        res.status(200)
        res.send(newlist)
    }


)

app.patch('/contacts/:contactId',
   
    async (req, res) => {
        const {contactId} = req.params;
        const newContact = await updateContact(contactId,req.body)
        res.status(200)
        res.send(newContact)
    }


)




app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})




