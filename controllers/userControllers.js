const User = require('../models/User');
const Note = require('../models/Notes');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');


//@desc Get all user
//@route GET /users
//@access Private

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').learn();
    if(!users) return res.status(400).json({ message: 'No users found'});

    res.json(users);
});


//@desc Create user
//@route PATCH/users
//@accessPrivate

const createNewUsers = asyncHandler(async (req, res) => {
    const { username, password, roles} = req.body;

    //confirm data
    if(!username || !password || !Array.isArray(roles || !roles.length)) {
        return res.status(400).json({ message: 'All field required'});
    };


    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username '});
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) //salt round

    const userObject = { username, "password": hashedPwd, roles};

    //create and store new user
    const user = await User.create(userObject);

    if(user) {
        res.status(201).json({ message: `New user ${username} created`});
    } else {
        res.status(400).json({ message: 'Invalid user data received '});
    };
});

//@desc Create user
//@route PATCH/users
//@accessPrivate

const updateUsers = asyncHandler(async (req, res) => {});

//@desc Create user
//@route PATCH/users
//@accessPrivate

const deleteUsers = asyncHandler(async (req, res) => {});


module.export = {
    getAllUsers,
    createNewUsers,
    updateUsers,
    deleteUsers
}