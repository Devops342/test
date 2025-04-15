const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  countUsers,
  adminAddUser,
  getUserspagination,
} = require("../controllers/adminController.js");

const { protect, isAdmin } = require("../middleware/authMiddleware..js");

router.use(protect, isAdmin);
router.get("/count", countUsers);

router.get("/", isAdmin, getUsers);
router.get("/pagination",isAdmin, getUserspagination);
router.get("/:id",isAdmin, getUser);
router.post("/add",isAdmin, adminAddUser);
router.post("/update",isAdmin, updateUser);
router.delete("/delete/:id",isAdmin, deleteUser);

module.exports = router;
