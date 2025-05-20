"use client"

import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getCourses,
  getCourse,
  enrollUserInCourse,
  unenrollUserFromCourse,
  getUserEnrollments,
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
  updateLessonProgress,
  getUserCourseProgress,
} from "@/lib/firebase"

// Helper function to safely execute operations
async function safeOperation<T>(operation: () => Promise<T>, errorMessage: string): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    throw error
  }
}

// Re-export the functions with error handling
export const userServices = {
  createProfile: (userId: string, data: any) =>
    safeOperation(() => createUserProfile(userId, data), "Failed to create user profile"),

  getProfile: (userId: string) => safeOperation(() => getUserProfile(userId), "Failed to get user profile"),

  updateProfile: (userId: string, data: any) =>
    safeOperation(() => updateUserProfile(userId, data), "Failed to update user profile"),
}

export const courseServices = {
  getAll: () => safeOperation(() => getCourses(), "Failed to get courses"),

  getById: (courseId: string) => safeOperation(() => getCourse(courseId), "Failed to get course"),

  enroll: (userId: string, courseId: string) =>
    safeOperation(() => enrollUserInCourse(userId, courseId), "Failed to enroll in course"),

  unenroll: (userId: string, courseId: string) =>
    safeOperation(() => unenrollUserFromCourse(userId, courseId), "Failed to unenroll from course"),

  getUserEnrollments: (userId: string) =>
    safeOperation(() => getUserEnrollments(userId), "Failed to get user enrollments"),
}

export const noteServices = {
  getAll: (userId: string, courseId?: string) =>
    safeOperation(() => getUserNotes(userId, courseId), "Failed to get notes"),

  create: (noteData: any) => safeOperation(() => createNote(noteData), "Failed to create note"),

  update: (noteId: string, content: string) =>
    safeOperation(() => updateNote(noteId, content), "Failed to update note"),

  delete: (noteId: string) => safeOperation(() => deleteNote(noteId), "Failed to delete note"),
}

export const progressServices = {
  updateLesson: (userId: string, courseId: string, lessonId: string, completed: boolean) =>
    safeOperation(
      () => updateLessonProgress(userId, courseId, lessonId, completed),
      "Failed to update lesson progress",
    ),

  getCourseProgress: (userId: string, courseId: string) =>
    safeOperation(() => getUserCourseProgress(userId, courseId), "Failed to get course progress"),
}

// For backward compatibility
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getCourses,
  getCourse,
  enrollUserInCourse,
  unenrollUserFromCourse,
  getUserEnrollments,
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
  updateLessonProgress,
  getUserCourseProgress,
}
