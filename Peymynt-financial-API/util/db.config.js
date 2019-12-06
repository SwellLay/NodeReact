import mongoose from 'mongoose';
mongoose.set('useFindAndModify', false);

// help to debug mongoose
if (process.env.NODE_ENV !== "production")
    mongoose.set("debug", true);

const uri = process.env.MONGO_URL;

console.log(` DB Url ===> ${uri}`);

const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, //Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6,
    keepAlive: true
};

try {
    mongoose.connect(uri, options);
} catch (error) {
    console.log(`Error -------> ${error}`);
    process.exit(1);
}

// peymynt google credential
export const googleCliendId = process.env.GOOGLE_CLIENT_ID;
export const googleClientSecret = process.env.GOOGLE_SECRET;
