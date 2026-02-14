import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import studentModel from "../Models/studentModel.js";
const router = express.Router();

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let newFile = Date.now() + path.extname(file.originalname);
    cb(null, newFile);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else if (file.mimetype.startsWith("application/pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only Images Are allowed!!"), false);
  }
};

const upload = multer({
  storage: Storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 50 },
});

// Insert Data API

router.post("/", upload.single("student_photo"), async (req, res) => {
  try {
    if (req.file) {
      req.body.student_photo = req.file.filename;
    }
    let newStudentData = await studentModel.create(req.body);
    console.log(newStudentData);
    res.status(201).json(newStudentData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Read data
router.get("/", async (req, res) => {
  try {
    let data = await studentModel.find(req.body);
    console.log(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Read One Data

router.get("/:id", async (req, res) => {
  try {
    let data = await studentModel.findById(req.params.id);
    if (!data)
      res.status(404).json({
        message: "Student data not found!",
      });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Student Update Data

router.put("/:id", async (req, res) => {
  try {
    let data = await studentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data)
      res.status(404).json({
        message: "Student data not found!",
      });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student data with fs module for image

router.put("/:id", upload.single("student_photo"), async (req, res) => {
  try {
    let existingStudent = await studentModel.findById(req.params.id);
    //Duplicate image update

    if (!existingStudent) {
      if (req.file.filename) {
        const filePath = path.join("./uploads", req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Failed to delete image", err);
          }
        });
      }
      return res.status(404).json({ message: "Student data not found" });
    }

    //image update

    if (req.file) {
      if (existingStudent.student_photo) {
        let oldFilePath = path.join("./uploads", existingStudent.student_photo);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.log("Failed to update image", err);
          }
        });
      }
      req.body.student_photo = req.file.filename;
    }

    let data = await studentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data)
      res.status(404).json({
        message: error.message,
      });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Search Api

router.get("/search/:key", async (req, res) => {
  try {
    let key = req.params.key;
    let searchCon = [
      { student_name: { $regex: key, $options: "i" } },
      { student_email: { $regex: key, $options: "i" } },
    ];
    if (!isNaN(key)) {
      searchCon.push({
        $or: [{ student_age: Number(key) }, { _id: Number(key) }],
      });
    }
    let data = await studentModel.find({
      $or: searchCon,
    });

    if (data.length === 0) {
      res.status(404).json({ message: "Student data not found" });
    }
    res.status(200).json({ message: "Searched Data:", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Data

router.delete("/:id", async (req, res) => {
  try {
    let data = await studentModel.findByIdAndDelete(req.params.id);
    if (!data.student_photo) {
      let oldFilePath = path.join("./uploads", data.student_photo);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.log("failed to delete img!!", err);
      });
    }
    res.json({ message: "message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
