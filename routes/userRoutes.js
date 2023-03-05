const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userControllers');

router.route('/')
.get(usersController.getAllUser)
.post(usersController.createNewUser)
.patch(usersController.updateUser)
.delete(usersController.deleteUsers)

module.exports = router;