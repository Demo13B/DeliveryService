const Advertisement = require('../models/advertisement');

const find = (params) => {
    let query = { isDeleted: false };

    if ('shortText' in params) {
        query.shortText = { $regex: params.shortText };
    }
    if ('description' in params) {
        query.description = { $regex: params.description };
    }
    if ('userId' in params) {
        query.userId = params.userId
    }
    if ('tags' in params) {
        query.tags = { $all: params.tags }
    }

    const res = Advertisement.find(query);
    return res;
}

const findById = (id) => {
    const ad = Advertisement.findById(id);
    return ad;
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

module.exports = { find, findById, create, remove }