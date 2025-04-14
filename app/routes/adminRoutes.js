const express = require('express');
const router = express.Router();
const {getUsers, getUser, updateUser, deleteUser, countUsers, adminAddUser} = require('../controllers/adminController.js');

const { protect, isAdmin } = require('../middleware/authMiddleware..js');

router.use(protect, isAdmin);
router.get('/count', countUsers);


router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/add', adminAddUser);
router.post('/update', updateUser);
router.delete('/delete/:id', deleteUser);



module.exports = router;
