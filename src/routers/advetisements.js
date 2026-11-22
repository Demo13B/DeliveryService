const express = require('express');

const AdvertisementModule = require('../modules/advertisements');
const UserModule = require('../modules/users');
const idCheck = require('../validators/id');

const router = express.Router();

router.get('/', async (req, res) => {
    let ads;
    try {
        const params = {};
        if (req.query.shortText)
            params.shortText = req.query.shortText;
        if (req.query.description)
            params.description = req.query.description;
        if (req.query.userId)
            params.userId = req.query.userId;
        if (req.query.tags)
            params.tags = req.query.tags;

        ads = await AdvertisementModule.find(params);
    } catch (e) {
        console.log(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }

    const data = []
    for (ad of ads) {
        let user;
        try {
            user = await UserModule.findById(ad.userId);
        } catch (e) {
            console.log(e);
            res.status(400).send({ error: e, status: 'error' });
            return;
        }
        data.push({
            id: ad._id,
            shortTitle: ad.shortText,
            description: ad.description,
            images: ad.images,
            user: user,
            createdAt: ad.createdAt
        });
    }

    res.send({ data: data, status: 'ok' });
});

router.get('/:id', idCheck.mongoIdCheck, async (req, res) => {
    let ad;
    try {
        ad = await AdvertisementModule.findById(req.params.id);
    } catch (e) {
        console.log(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }

    if (!ad) {
        res.status(404).send('Advertisement not found');
    }

    let user;
    try {
        user = await UserModule.findById(ad.userId);
    } catch (e) {
        console.log(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }
    data = {
        id: ad._id,
        shortTitle: ad.shortText,
        description: ad.description,
        images: ad.images,
        user: user,
        createdAt: ad.createdAt
    };

    res.send({ data: data, status: 'ok' });
});

module.exports = router;