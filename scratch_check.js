const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const checkDocs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");
        
        const Subject = require("./src/models/Subject");
        const Student = require("./src/models/Student");

        const subjects = await Subject.find({ branch: "CSE", semester: 6 });
        console.log("Subjects in CSE Sem 6 in DB:", subjects.length);
        console.log(subjects.map(s => s.name));

        const student = await Student.findOne({ branch: "CSE", semester: 6 });
        if(student) {
           console.log("First Student Subjects Array Length:", student.subjects.length);
           console.log("Array exact:", student.subjects);
        }

    } catch (err) {
        console.log("Failed: ", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
};

checkDocs();
