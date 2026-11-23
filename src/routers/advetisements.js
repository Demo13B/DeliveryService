const express = require('express');

const AdvertisementModule = require('../modules/advertisements');
const UserModule = require('../modules/users');
const idCheck = require('../validators/id');
const authMiddleware = require('../middleware/auth');
const fileFetcher = require('../middleware/multer');

const router = express.Router();

router.get('/', async (req, res) => {
    let ads;
    try {
        const params = {};
        if (req.query.shortTitle)
            params.shortTitle = req.query.shortTitle;
        if (req.query.description)
            params.description = req.query.description;
        if (req.query.userId)
            params.userId = req.query.userId;
        if (req.query.tags)
            params.tags = req.query.tags;

        ads = await AdvertisementModule.find(params);
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }

    const data = []
    for (ad of ads) {
        let user;
        try {
            user = await UserModule.findById(ad.userId);
        } catch (e) {
            console.error(e);
            res.status(400).send({ error: e, status: 'error' });
            return;
        }
        data.push({
            id: ad._id,
            shortTitle: ad.shortTitle,
            description: ad.description,
            images: ad.images,
            user: {
                id: user._id,
                name: user.name
            },
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
        console.error(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }

    if (!ad) {
        res.status(404).send('Advertisement not found');
    }

    if (ad.isDeleted) {
        res.status(404).send({ error: 'Объявление было удалено', status: 'error' });
    }

    let user;
    try {
        user = await UserModule.findById(ad.userId);
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }
    data = {
        id: ad._id,
        shortTitle: ad.shortTitle,
        description: ad.description,
        images: ad.images,
        user: {
            id: user._id,
            name: user.name
        },
        createdAt: ad.createdAt
    };

    res.send({ data: data, status: 'ok' });
});

router.post('/', authMiddleware, fileFetcher.array('images', 10), async (req, res) => {
    if (!('shortTitle' in req.body))
        return res.status(400).send({ error: 'Нет shortTitle', status: 'error' });
    if (!('description' in req.body))
        req.body.description = '';
    const images = req.files.map(file => file.path);

    const data = {
        shortTitle: req.body.shortTitle,
        description: req.body.description,
        images,
        userId: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        isDeleted: false
    }

    const ad = await AdvertisementModule.create(data);
    res.redirect(`/api/advertisements/${ad._id}`);
});

router.delete('/:id', idCheck.mongoIdCheck, authMiddleware, async (req, res) => {
    let ad;
    try {
        ad = await AdvertisementModule.findById(req.params.id);
        if (ad === null)
            return res.status(404).send({ error: 'Объявление не найдено', status: 'error' });
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }

    if (ad.userId.toString() !== req.user._id.toString())
        return res.status(403).send({ error: 'Объявление не принадлежит пользователю', status: 'error' });

    try {
        await AdvertisementModule.remove(req.params.id);
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: e, status: 'error' });
        return;
    }

    res.sendStatus(204);
});

module.exports = router;