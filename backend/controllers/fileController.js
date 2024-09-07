// backend/controllers/fileController.js

const express = require('express');
const Album = require('../models/file-model');
const upload = require('../middleware/upload'); // Import upload correctly

const router = express.Router();

// POST: Upload album
router.post('/:userid', upload.any(), async (req, res) => {
    try {
        const filePaths = req.files.map((file) => file.path);

        const albumphoto = await Album.create({
            user_id: req.params.userid,
            title: req.body.title,
            img: filePaths,
        });

        console.log(albumphoto);
        return res.status(201).send(albumphoto);
    } catch (e) {
        return res.status(500).json({ status: 'failed', message: e.message });
    }
});

// GET: Fetch albums
router.get('/:userid', async (req, res) => {
    try {
        const albums = await Album.find({ user_id: req.params.userid })
            .lean()
            .exec();
        console.log(albums);
        return res.status(200).send(albums);
    } catch (e) {
        return res.status(500).json({ status: 'failed', message: e.message });
    }
});

// DELETE: Delete an album
router.delete('/:userid/:albumid', async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.albumid)
            .lean()
            .exec();
        console.log(album);
        return res.status(200).send(album);
    } catch (e) {
        return res.status(500).json({ status: 'failed', message: e.message });
    }
});

// PATCH: Update an album
router.patch('/:userid/:albumid', async (req, res) => {
    try {
        const album = await Album.findByIdAndUpdate(
            req.params.albumid,
            req.body,
            { new: true }
        )
            .lean()
            .exec();
        res.status(200).send(album);
    } catch (e) {
        res.status(500).json({ message: e.message, status: 'Failed' });
    }
});

module.exports = router;
