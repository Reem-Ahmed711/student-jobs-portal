// MOBILE-APP/app-backend/src/Service/studentService.js
const { admin, db } = require("../firebase");

// update student
const updateStudentProfile = async (studentUid, updateData) => {
  try {
    // ver
    const studentDoc = await db.collection("users").doc(studentUid).get();
    if (!studentDoc.exists) {
      throw new Error("Student not found");
    }

    if (studentDoc.data().role !== "student") {
      throw new Error("User is not a student");
    }

    const allowedFields = [
      "name",
      "phone",
      "department",
      "year",
      "gpa",
      "skills",
      "about",
      "profileImage",
      "cv",
      "linkedin",
      "github",
    ];

    // filters
    const filteredData = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    if (filteredData.year) {
      filteredData.year = Number(filteredData.year) || filteredData.year;
    }

    // GPA
    if (filteredData.gpa) {
      const gpaNum = parseFloat(filteredData.gpa);
      if (gpaNum >= 0 && gpaNum <= 5) {
        filteredData.gpa = gpaNum;
      } else {
        throw new Error("GPA must be between 0 and 5");
      }
    }

    //skills
    if (filteredData.skills && typeof filteredData.skills === "string") {
      filteredData.skills = filteredData.skills.split(",").map((s) => s.trim());
    }

    //time
    filteredData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // update data
    await db.collection("users").doc(studentUid).update(filteredData);

    // get data
    const updatedDoc = await db.collection("users").doc(studentUid).get();

    return {
      success: true,
      message: "Profile updated successfully",
      data: { id: updatedDoc.id, ...updatedDoc.data() },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// get data student
const getStudentProfile = async (studentUid) => {
  try {
    const studentDoc = await db.collection("users").doc(studentUid).get();
    if (!studentDoc.exists) {
      throw new Error("Student not found");
    }

    return {
      success: true,
      data: { id: studentDoc.id, ...studentDoc.data() },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  updateStudentProfile,
  getStudentProfile,
};
