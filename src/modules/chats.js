const Chat = require('../models/chat');

const find = (users) => {
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

    return chat.messages[chat.messages.length - 1];
}

module.exports = { find, sendMessage };