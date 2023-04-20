const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize("Employee", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("user", {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  age: Sequelize.INTEGER,
});

sequelize.sync();

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = await User.create({ name, email, age });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to create user",
      error: error.message,
    });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      data: {
        users: users,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: null,
      error: {
        success: false,
        message: "Unable to retrieve users",
        errorMessage: error.message,
      },
    });
  }
});

// Get a user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    } else {
      res.json({
        success: true,
        message: "User retrieved successfully",
        data: user,
        error: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve user",
      data: null,
      error: error.message,
    });
  }
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      const { name, email, age } = req.body;
      await user.update({ name, email, age });
      res.json({
        success: true,
        message: "User updated successfully",
        user: user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to update user",
      error: error.message,
    });
  }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      await user.destroy();
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to delete user",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
