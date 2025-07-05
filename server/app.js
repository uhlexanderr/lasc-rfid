require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/Student");
const { authenticateToken } = require("./middleware/auth");
const authRoutes = require("./routes/auth");

const app = express();
const port = 8003;

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Auth routes (no authentication required for login)
app.use("/api/auth", authRoutes);

// Public RFID endpoint
app.get("/api/rfid/:rfid", async (req, res) => {
  try {
    const student = await Student.findOne({ rfid: req.params.rfid, archived: { $ne: true } });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error });
  }
});

// Protected routes - require admin authentication
app.use("/api/students", authenticateToken);

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
    let studentData = req.body;
    // Log the full incoming request body for debugging
    console.log("[DEBUG] Incoming POST /api/students payload:", JSON.stringify(studentData, null, 2));
    // Remove empty string fields
    Object.keys(studentData).forEach(key => {
      if (studentData[key] === "") {
        delete studentData[key];
      }
    });

    // Required fields
    if (!studentData.lastName || !studentData.firstName || !studentData.grlvl || !studentData.sy) {
      return res.status(400).json({ message: "lastName, firstName, grlvl, and sy are required" });
    }

    if (studentData.lrn && !/^\d{12}$/.test(studentData.lrn)) {
      return res.status(400).json({ message: "LRN must be exactly 12 digits." });
    }

    if (studentData.mobileNo && !/^\d{10,11}$/.test(studentData.mobileNo)) {
      return res.status(400).json({ message: "Mobile number must be 10 or 11 digits." });
    }

    if (studentData.rfid && !/^\d+$/.test(studentData.rfid)) {
      return res.status(400).json({ message: "RFID must be numbers only." });
    }

    if (studentData.lrn) {
      const lrnExists = await Student.findOne({ lrn: studentData.lrn });
      if (lrnExists) {
        return res.status(400).json({ message: "LRN already exists. Please enter a unique LRN." });
      }
    }

    if (studentData.rfid) {
      const rfidExists = await Student.findOne({ rfid: studentData.rfid });
      if (rfidExists) {
        return res.status(400).json({ message: "RFID already exists. Please enter a unique RFID." });
      }
    }

    if (studentData.pic && typeof studentData.pic === 'string' && studentData.pic.length > 0) {
      // Check if it's a base64 image (starts with data:image)
      if (studentData.pic.startsWith('data:image')) {
        const base64Length = studentData.pic.length - (studentData.pic.indexOf(',') + 1);
        const sizeInBytes = Math.ceil(base64Length * 3 / 4);
        if (sizeInBytes > 5 * 1024 * 1024) {
          return res.status(400).json({ message: "Image size must be less than or equal to 5MB." });
        }
      }
      // If it's a URL (like Firebase Storage URL), we don't need to validate size
    }

    // ✅ Simplified log
    console.log(`📥 Received: ${studentData.firstName} ${studentData.lastName} (${studentData.grlvl})`);

    const newStudent = new Student(studentData);
    await newStudent.save();

    // ✅ Simplified log
    console.log(`✅ Saved: ${newStudent.firstName} ${newStudent.lastName} | ID: ${newStudent._id}`);

    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    // Log the error stack for comprehensive debugging
    console.error("[ERROR] Error adding student:", error.stack || error);
    res.status(500).json({ message: "Error adding student", error });
  }
});

// Route to get a student by ID
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

// Route to update a student
app.put("/api/students/:id", async (req, res) => {
  try {
    let studentData = req.body;
    // Remove empty string fields
    Object.keys(studentData).forEach(key => {
      if (studentData[key] === "") {
        delete studentData[key];
      }
    });

    // Required fields
    if (!studentData.lastName || !studentData.firstName || !studentData.grlvl || !studentData.sy) {
      return res.status(400).json({ message: "lastName, firstName, grlvl, and sy are required" });
    }

    if (studentData.lrn && !/^\d{12}$/.test(studentData.lrn)) {
      return res.status(400).json({ message: "LRN must be exactly 12 digits." });
    }

    if (studentData.mobileNo && !/^\d{10,11}$/.test(studentData.mobileNo)) {
      return res.status(400).json({ message: "Mobile number must be 10 or 11 digits." });
    }

    if (studentData.rfid && !/^\d+$/.test(studentData.rfid)) {
      return res.status(400).json({ message: "RFID must be numbers only." });
    }

    if (studentData.lrn) {
      const lrnExists = await Student.findOne({ lrn: studentData.lrn, _id: { $ne: req.params.id } });
      if (lrnExists) {
        return res.status(400).json({ message: "LRN already exists. Please enter a unique LRN." });
      }
    }

    if (studentData.rfid) {
      const rfidExists = await Student.findOne({ rfid: studentData.rfid, _id: { $ne: req.params.id } });
      if (rfidExists) {
        return res.status(400).json({ message: "RFID already exists. Please enter a unique RFID." });
      }
    }

    if (studentData.pic && typeof studentData.pic === 'string' && studentData.pic.length > 0) {
      // Check if it's a base64 image (starts with data:image)
      if (studentData.pic.startsWith('data:image')) {
        const base64Length = studentData.pic.length - (studentData.pic.indexOf(',') + 1);
        const sizeInBytes = Math.ceil(base64Length * 3 / 4);
        if (sizeInBytes > 5 * 1024 * 1024) {
          return res.status(400).json({ message: "Image size must be less than or equal to 5MB." });
        }
      }
      // If it's a URL (like Firebase Storage URL), we don't need to validate size
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, studentData, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Simplified log
    console.log(`📝 Updated: ${updatedStudent.firstName} ${updatedStudent.lastName} | ID: ${updatedStudent._id}`);

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

    // ✅ Simplified log
    console.log(`📦 Archived: ${updatedStudent.firstName} ${updatedStudent.lastName}`);

    res.status(200).json({ message: "Student archived successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error archiving student", error });
  }
});

// Route to permanently delete a student
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

    // ✅ Simplified log
    console.log(`🗑️ Deleted: ${student.firstName} ${student.lastName} (archived)`);

    res.status(200).json({ message: "Student permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
});

// Route to restore a student
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

    // ✅ Simplified log
    console.log(`♻️ Restored: ${updatedStudent.firstName} ${updatedStudent.lastName}`);

    res.status(200).json({ message: "Student restored successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error restoring student", error });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is starting at port ${port}`);
});
