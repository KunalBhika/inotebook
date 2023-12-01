const express = require('express');
const fetchUser = require('../middleWare/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/fetchAllNotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.userId.id });
        if(!notes)
            return res.send('no notes till date');
        return res.send(notes);
    }
    catch {
        return res.status(500).send('internal server error');
    }
});

const noteValidation = [
    body('title', 'Enter a valid title').isLength({min : 3}),
    body('description', 'Enter a valid description').isLength({min : 5})
];

router.post('/addNote' , fetchUser , noteValidation , (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.send({errors});
    try {
        const user = req.userId.id;
        const { title, description, tag } = req.body;
        const Note = Notes({
            user, title, description, tag
        })
        Note.save().then(Note => res.send(Note)).catch(err => res.send(err));
    } catch {
        return res.status(500).send('internal server error');
    }   
});

router.put('/updateNote/:id' , fetchUser , async (req, res) => {
    const Curruser = req.userId.id;
    const {title , description , tag} = req.body;

    const note = await Notes.findById(req.params.id);

    if(note.user != Curruser) {
        return res.status(401).send({error : 'Access denied'});
    }

    if(title)
        note.title = title;
    if(description)
        note.description = description;
    if(tag)
        note.tag = tag;
    
    const updatedNote = await Notes.findByIdAndUpdate(req.params.id , {$set : note} , {new : true});
    
    return res.send(updatedNote);
})

module.exports = router;