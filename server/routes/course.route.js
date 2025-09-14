import express from "express";
import { 
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getAllCourses,
  getCourseLectures,
  getCreatorCourses,
  getLectureById,
  getSingleCourse,
  removeLecture,
  searchCourse, 
  togglePublishCourse,
} from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/create").post(isAuthenticated, createCourse);
router.route("/edit/:courseId").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/creator-course").get(isAuthenticated,getCreatorCourses);
router.route("/").get(getAllCourses);
router.route("/search").get(isAuthenticated,searchCourse);
router.route("/:courseId").get(isAuthenticated,getSingleCourse);
// for lectures routes
router.route("/:courseId/lectures").get(isAuthenticated,getCourseLectures);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/:courseId").put(isAuthenticated, togglePublishCourse);

export default router;
