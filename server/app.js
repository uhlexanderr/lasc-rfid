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

// Route to get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({ archived: { $ne: true } });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// Route to get all archived students
app.get("/api/students/archived", async (req, res) => {
  try {
    const archivedStudents = await Student.find({ archived: true });
    res.status(200).json({ students: archivedStudents });
  } catch (error) {
    res.status(500).json({ message: "Error fetching archived students", error });
  }
});

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

// Route to update a student by ID
app.put("/api/students/:id", async (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData.lastName || !studentData.firstName) {
      return res.status(400).json({ message: "lastName and firstName are required" });
    }
    console.log("Updating student data:", studentData);
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, studentData, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    console.log(`Updated student: ${updatedStudent.firstName} ${updatedStudent.lastName} (ID: ${updatedStudent._id})`);
    res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
});

// Route to archive a student
app.put("/api/students/:id/archive", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      { archived: true, archivedAt: new Date() }, 
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    console.log("Student archived:", updatedStudent);
    res.status(200).json({ message: "Student archived successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error archiving student", error });
  }
});

// Route to permanently delete a student from archive
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!student.archived) {
      return res.status(400).json({ message: "Only archived students can be permanently deleted" });
    }
    await Student.findByIdAndDelete(req.params.id);
    console.log("Student permanently deleted:", student);
    res.status(200).json({ message: "Student permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
});

// Route to restore an archived student
app.put("/api/students/:id/restore", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      { archived: false, archivedAt: null }, 
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    console.log("Student restored:", updatedStudent);
    res.status(200).json({ message: "Student restored successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error restoring student", error });
  }
});

app.listen(port,()=>{
    console.log(`server is starting at port ${port}`);
});