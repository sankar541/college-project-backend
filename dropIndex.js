const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");
        
        const Subject = require("./src/models/Subject");
        await Subject.collection.dropIndex("code_1");
        console.log("Successfully dropped exact unique index 'code_1' from subjects collection.");

    } catch (err) {
        console.log("Index might not exist or failed: ", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
};

dropIndex();
