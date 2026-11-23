const socketIo = require('socket.io')

const ChatModule = require('./modules/chats');
const passport = require('./passport');
const session = require('./middleware/session');

async function createSocket(server) {
    const io = socketIo(server);

    io.engine.use(session);
    io.engine.use(passport.initialize());
    io.engine.use(passport.session());
    io.engine.use((req, res, next) => {
        if (!req.user) {
            res.writeHead(401);
            res.end();
        } else {
            next();
        }
    });

    ChatModule.subscribe((data) => {
        const { chatId, message } = data;

        io.to(chatId.toString()).emit('newMessage', message);
    });


    io.on('connection', (socket) => {
        socket.on('getHistory', async (data) => {
            const users = [socket.request.user._id.toString(), data.userId];
            let chat;
            try {
                chat = await ChatModule.find(users);
            } catch (e) {
                console.error(e);
                return;
            }
            if (!chat) {
                socket.emit('chatHistory', []);
                return;
            }
            const chatId = chat._id.toString();

            socket.join(chatId);

            let history;
            try {
                history = await ChatModule.getHistory(chatId);
            } catch (e) {
                console.error(e);
                return;
            }

            socket.emit('chatHistory', history);
        });

        socket.on('sendMessage', async (data) => {
            const author = socket.request.user._id.toString();

            const parameters = {
                author,
                receiver: data.receiver,
                text: data.text
            }

            try {
                await ChatModule.sendMessage(parameters);
            } catch (e) {
                console.error(e);
            }
        });
    });
}

module.exports = createSocket;