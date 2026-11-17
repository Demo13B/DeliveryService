const Advertisement = require('../models/advertisement');

const find = (params) => {
    let query = { isDeleted: false };

    if (params.shortText) {
        query.shortText = { $regex: params.shortText };
    }
    if (params.description) {
        query.description = { $regex: params.description };
    }
    if (params.userId) {
        query.userId = params.userId
    }
    if (params.tags) {
        query.tags = { $all: params.tags }
    }

    const res = Advertisement.find(query);
    return res;
}

const create = (data) => {
    const advertisement = new Advertisement(data);
    try {
        return advertisement.save();
    } catch (e) {
        console.error(e);
    }
}

const remove = async (id) => {
    let advertisement = await Advertisement.findById(id);
    if (!advertisement) {
        return null;
    }

    try {
        advertisement.isDeleted = true;
        return await advertisement.save();
    } catch (e) {
        console.error(e);
    }
}

module.exports = { find, create, remove }