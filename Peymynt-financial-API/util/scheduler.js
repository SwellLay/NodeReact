const Agenda = require('agenda');

const connectionString = process.env.MONGO_URL;

const agenda = new Agenda({
    db: {
        address: connectionString,
        collection: 'jobs',
        options: {
            useNewUrlParser: true,
        }
    },
    processEvery: '30 seconds'
});

module.exports = agenda;