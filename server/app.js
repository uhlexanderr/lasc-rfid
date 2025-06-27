require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/Student");
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = 8003;

// Route to add a new student
app.post("/api/students", async (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData.lastName || !studentData.firstName) {
      return res.status(400).json({ message: "lastName and firstName are required" });
    }
    console.log("Received student data:", studentData);
    const newStudent = new Student(studentData);
    await newStudent.save();
    console.log("Saved student document:", newStudent);
    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Error adding student", error });
  }
});

// Route to get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// Route to get a single student by ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error });
  }
});

app.listen(port,()=>{
    console.log(`server is starting at port ${port}`);
});