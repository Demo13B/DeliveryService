const EventEmitter = require('events');

const Chat = require('../models/chat');

const emitter = new EventEmitter();

const find = async (users) => {
    return Chat.findOne({ users: { $all: users, $size: 2 } });
}

const sendMessage = async (data) => {
    const message = {
        author: data.author,
        sentAt: new Date(),
        text: data.text
    };

    const query = [data.author, data.receiver];
    let chat = await find(query);
    if (!chat) {
        chat = new Chat({
            users: query,
            createdAt: new Date(),
            messages: [message]
        });
    } else {
        chat.messages.push(message);
    }

    await chat.save();

    emitter.emit('message', {
        chatId: chat._id,
        message: chat.messages[chat.messages.length - 1]
    });

    return chat.messages[chat.messages.length - 1];
}

const subscribe = (cb) => {
    emitter.on('message', (data) => {
        cb(data);
    });
}

const getHistory = async (id) => {
    const chat = await Chat.findById(id);
    if (!chat)
        return null;
    return chat.messages;
}

module.exports = { find, sendMessage, subscribe, getHistory };