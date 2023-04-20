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


// // Get all users with searching
// app.get("/users", async (req, res) => {
//   try {
//     const {searchBy = 'email', searchTerm = ''} = req.query;
//     const users = await User.findAll({
//       where: {
//         [searchBy]: {
//           [Op.like]: `%${searchTerm}%`
//         }
//       }
//     });
//     res.json({
//       data: {
//         users: users,
//       },
//       error: null,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       data: null,
//       error: {
//         success: false,
//         message: "Unable to retrieve users",
//         errorMessage: error.message,
//       },
//     });
//   }
// });


// Get all users with optional search by name
app.get("/users", async (req, res) => {
  try {
    const { search } = req.query;
    const queryOptions = {};
    
    if (search) {
      queryOptions.where = { name: { [Op.like]: `%${search}%` } };
    }

    const users = await User.findAll(queryOptions);
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
// queryOptions.where = { name: { [Op.like]: `%${search}%` } }; we can importve any other query we can use

// Yes, Sequelize supports many other query options that can be used to perform different types of queries. Some of the commonly used query options include:

// Op.eq: Matches values that are equal to the given value.
// Op.ne: Matches values that are not equal to the given value.
// Op.gt: Matches values that are greater than the given value.
// Op.gte: Matches values that are greater than or equal to the given value.
// Op.lt: Matches values that are less than the given value.
// Op.lte: Matches values that are less than or equal to the given value.
// Op.between: Matches values that are between the given range.
// Op.notBetween: Matches values that are not between the given range.
// Op.in: Matches values that are in the given array.
// Op.notIn: Matches values that are not in the given array.
// Op.like: Matches values that are like the given pattern.
// Op.notLike: Matches values that are not like the given pattern.
// You can refer to the Sequelize documentation for more information on available query options: https://sequelize.org/master/manual/querying.html#operators

// Get all users
// GET http://localhost:3000/users?searchBy=email&searchTerm=john

app.get("/users", async (req, res) => {
  try {
    const { sortBy } = req.query;
    const users = await User.findAll({
      order: sortBy ? [[sortBy, "ASC"]] : undefined,
    });
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
// http://localhost:3000/users?sort=age.desc

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
