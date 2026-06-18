const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://truonga-portfolio.vercel.app',
        'https://truonga-portfolio-*.vercel.app'
      ],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Visitor counter
    socket.on('visitor-join', () => {
      const count = io.engine.clientsCount;
      io.emit('visitor-count', count);
    });

    // New message notification (admin only)
    socket.on('new-message', (data) => {
      io.emit('admin-notification', {
        type: 'message',
        message: `New message from ${data.name}`,
        time: new Date()
      });
    });

    // Project update notification
    socket.on('project-updated', (data) => {
      io.emit('admin-notification', {
        type: 'project',
        message: `Project "${data.title}" updated`,
        time: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
      const count = io.engine.clientsCount;
      io.emit('visitor-count', count);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };