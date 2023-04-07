const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/buddies', UserController.getBuddies);
router.get('/buddies/:id', UserController.getBuddiesById);
router.post('/buddies/:id', UserController.postBuddies);
router.put('/buddies/:id', UserController.putBuddies);
router.delete('/buddies/:id', UserController.deleteBuddies);
module.exports = router;