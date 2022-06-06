const mongoose = require('mongoose');

const dbUri = process.env.MONGO_URI;


const dbConnect = mongoose.connect(dbUri)
                    .then(() => console.log(`Database connected successfully to ${dbUri}`))
                    .catch((err) => console.log(err));


module.exports = dbConnect;