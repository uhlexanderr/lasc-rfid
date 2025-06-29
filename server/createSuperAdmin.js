require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const mongoURI = process.env.MONGO_URI;

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Check if super-admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });
    if (existingSuperAdmin) {
      console.log("Super-admin already exists:", existingSuperAdmin.email);
      process.exit(0);
    }

    // Create super-admin account
    const superAdmin = new Admin({
      email: "admin@example.com", // Change this to your desired email
      password: "admin123", // Change this to your desired password
      role: "super-admin"
    });

    await superAdmin.save();
    console.log("Super-admin created successfully!");
    console.log("Email:", superAdmin.email);
    console.log("Role:", superAdmin.role);
    console.log("Please change the password after first login!");

  } catch (error) {
    console.error("Error creating super-admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createSuperAdmin(); 