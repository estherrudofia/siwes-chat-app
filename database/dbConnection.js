const mongoose = require('mongoose');

const dbUri = process.env.MONGO_URI;


const dbConnect = mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
                    .then(() => console.log(`Database connected successfully to ${dbUri}`))
                    .catch((err) => console.log(err));


module.exports = dbConnect;