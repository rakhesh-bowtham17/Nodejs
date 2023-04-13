const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/:id', controller.createUserRead);
router.get('/read/:id', controller.getUserById);
router.put('/update/:id', controller.updateUser);
router.delete('/delete/:id', controller.deleteUser);
router.post('/login',controller.loginUser);
router.post('/register',controller.registerUser);
router.get('/filter/:id1/:id2',controller.filteruser);
router.get('/sort/:id',controller.sortuser);
module.exports = router;