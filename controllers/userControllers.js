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

const updateUsers = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password} = req.body;

    //confirm data

    if( !id || !username || !Array.isArray|(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
        
    };

    const user = await User.findById(id).exec();

    if(!user) return res.status(400).json({ message: 'User not found'});

    //check for duplicate
    const duplicate = await User.findOne({ username}).lean().exec();

    //Allow updates to the original user
    if ( duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: 'Duplicate username '});

    user.username = username
    user.roles = roles
    user.active = active

    if ( password) {
        // Hash pasword
        user.password = await bcrypt.hash(password, 10) //salt round
    };

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated`})
});

//@desc Create user
//@route PATCH/users
//@accessPrivate

const deleteUsers = asyncHandler(async (req, res) => {
    if(!id)  return res.status(400).json({ message: "User ID Required " });

    const notes = await Note.findOne( { user: id}).lean().exec();

    if (notes?.length) return res.status(400).json({ message: 'User has assigned notes '});

    const user = await User.findById(id).exec();

    if(!user) return res.status(400).json({ message: 'User not found '});

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
    
});


module.export = {
    getAllUsers,
    createNewUsers,
    updateUsers,
    deleteUsers
}