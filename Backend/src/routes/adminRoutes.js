const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const {
  getAllEmployersController,
   getEmployerByIdController, 
   updateEmployerController,
  deleteEmployerController,
   toggleEmployerStatusController, 
  
  getAllStudentsController,
   getStudentByIdController, 
   updateStudentController,
  deleteStudentController, 
  toggleStudentStatusController,
   
  getPlatformStatsController,
} = require("../Controllers/adminController");

router.use(verifyToken, verifyRole("admin"));

// Employer
router.get("/employers",                    getAllEmployersController);
router.get("/employers/:uid",           getEmployerByIdController);
router.put("/employers/:uid",            updateEmployerController);
router.delete("/employers/:uid",             deleteEmployerController);
router.patch("/employers/:uid/toggle-status", toggleEmployerStatusController);

// Student 
router.get("/students",                   getAllStudentsController);
router.get("/students/:uid",          getStudentByIdController);
router.put("/students/:uid",               updateStudentController);
router.delete("/students/:uid",              deleteStudentController);
router.patch("/students/:uid/toggle-status",  toggleStudentStatusController);

// Platform Stats
router.get("/stats",    getPlatformStatsController);

module.exports = router;