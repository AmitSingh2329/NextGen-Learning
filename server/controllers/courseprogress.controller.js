import { CourseProgress } from "../models/courseprogress.model.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Step 1: Fetch the user's course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }
    // Step 2: If no progress found, return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed:false
        },
      });
    }

    // Step 3: Return the user's course progress along with course details
    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lecturesProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course progress.",
    });
  }
};

// Controller to update lecture progress
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // Fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      // If no progress exists, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lecturesProgress: [],
      });
    }

    // Find the lecture progress in the course progress
    const lectureIndex = courseProgress.lecturesProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );

    if (lectureIndex !== -1) {
      // If lecture already exists, update its status
      courseProgress.lecturesProgress[lectureIndex].viewed = true;
    } else {
      // Add new lecture progress
      courseProgress.lecturesProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // if all lecture is complete
    const lectureProgressLength = courseProgress.lecturesProgress.filter((lectureProg) => lectureProg.viewed).length;
    const course = await Course.findById(courseId);
    if(course.lectures.length === lectureProgressLength) courseProgress.completed = true;

    await courseProgress.save();

    res.json({ message: "Lecture progress updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update lecture progress." });
  }
};

// Controller to mark the entire course as completed
export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Fetch the course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found." });
    }

    courseProgress.lecturesProgress.map((lectureProgress) => lectureProgress.viewed = true);
    courseProgress.completed = true;
    await courseProgress.save();
    return res.json({ message: "Course marked as completed." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark course as completed." });
  }
};
export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Fetch the course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found." });
    }

    courseProgress.lecturesProgress.map((lectureProgress) => lectureProgress.viewed = false);
    courseProgress.completed = false;
    await courseProgress.save();
    return res.json({ message: "Course marked as incompleted." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark course as completed." });
  }
};
