const express = require('express');
const path = require('path');
const fs = require('fs');
const Files = require('../models/file-model');
const upload = require('../middleware/upload');
const router = express.Router();

// Function To Uploads the file
router.post('/:userid', upload.any(), async (req, res) => {
    try {
        const filePaths = req.files.map((file) => {
            return path.relative(path.join(__dirname, '..'), file.path);
        });
        const filesphoto = await Files.create({
            user_id: req.params.userid,
            title: req.body.title,
            img: filePaths,
            code: req.body.code,
        });
        return res.status(201).send(filesphoto);
    } catch (e) {
        return res.status(500).json({ status: 'failed', message: e.message });
    }
});

// Function To fetch the file
router.get('/:userid', async (req, res) => {
    try {
        const filess = await Files.find({ user_id: req.params.userid })
            .lean()
            .exec();
        return res.status(200).send(filess);
    } catch (e) {
        return res.status(500).json({ status: 'failed', message: e.message });
    }
});

// Function To Delete the file
router.delete('/:userid/:fileid', async (req, res) => {
    try {
        const files = await Files.findByIdAndDelete(req.params.fileid)
            .lean()
            .exec();
        console.log(files);
        return res.status(200).send(files);
    } catch (e) {
        return res.status(500).json({ status: 'failed', message: e.message });
    }
});

// Function To Edit the file
router.patch('/:userid/:fileid', async (req, res) => {
    try {
        const files = await Files.findByIdAndUpdate(
            req.params.fileid,
            { title: req.body.title }, // Updating the title only
            { new: true }
        )
            .lean()
            .exec();
        res.status(200).send(files);
    } catch (e) {
        res.status(500).json({ message: e.message, status: 'Failed' });
    }
});

// Function To Download the file
router.get('/download-image/:code', async (req, res) => {
    try {
        const files = await Files.findOne({ code: req.params.code });
        if (!files) {
            return res.status(404).json({ message: 'Files not found' });
        }
        const imagePath = files.img[0]; // Update it For multiple images
        const absolutePath = path.resolve(imagePath);

        if (fs.existsSync(absolutePath)) {
            res.download(absolutePath, (err) => {
                if (err) {
                    console.error('Error while downloading the file:', err);
                    return res.status(500).send('Error downloading the file');
                }
            });
        } else {
            return res.status(404).json({ message: 'File not found' });
        }
    } catch (e) {
        return res.status(500).json({ status: 'failed', message: e.message });
    }
});

module.exports = router;
