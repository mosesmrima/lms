"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  addCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  addAttachment,
  deleteAttachment,
  enrollUserInCourse,
  unenrollUserFromCourse,
  getUserEnrollments,
  updateLessonProgress,
  getUserCourseProgress,
  addNote,
  updateNote,
  deleteNote,
  getUserNotes,
} from "./firebase"
import type { Course, Lesson, Attachment, Note } from "./types"

interface AuthState {
  isAuthenticated: boolean
  userRole: "student" | "instructor" | "admin" | null
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setUserRole: (role: "student" | "instructor" | "admin" | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userRole: null,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUserRole: (userRole) => set({ userRole }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

interface StoreState {
  // Courses
  courses: Course[]
  setCourses: (courses: Course[]) => void
  addCourse: (course: Omit<Course, "id">) => Promise<string>
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>
  deleteCourse: (id: string) => Promise<void>

  // Lessons
  addLesson: (courseId: string, lesson: Omit<Lesson, "id">) => Promise<string>
  updateLesson: (courseId: string, lessonId: string, lesson: Partial<Lesson>) => Promise<void>
  deleteLesson: (courseId: string, lessonId: string) => Promise<void>

  // Attachments
  addAttachment: (courseId: string, lessonId: string, attachment: Omit<Attachment, "id">) => Promise<string>
  deleteAttachment: (courseId: string, lessonId: string, attachmentId: string) => Promise<void>

  // Enrollments
  enrolledCourses: string[]
  enrollInCourse: (userId: string, courseId: string) => Promise<void>
  unenrollFromCourse: (userId: string, courseId: string) => Promise<void>
  fetchEnrolledCourses: (userId: string) => Promise<void>

  // Progress
  courseProgress: Record<string, Record<string, { completed: boolean }>>
  markLessonCompleted: (userId: string, courseId: string, lessonId: string, completed: boolean) => Promise<void>
  fetchCourseProgress: (userId: string, courseId: string) => Promise<void>

  // Notes
  notes: Record<string, Record<string, Note>>
  addNote: (userId: string, courseId: string, lessonId: string, content: string) => Promise<string>
  updateNote: (userId: string, courseId: string, lessonId: string, noteId: string, content: string) => Promise<void>
  deleteNote: (userId: string, courseId: string, lessonId: string, noteId: string) => Promise<void>
  fetchNotes: (userId: string, courseId: string, lessonId: string) => Promise<void>
}

export const useStore = create<StoreState>((set, get) => ({
  // Courses
  courses: [],
  setCourses: (courses) => set({ courses }),
  addCourse: async (course) => {
    const id = await addCourse(course)
    set((state) => ({
      courses: [...state.courses, { id, ...course }],
    }))
    return id
  },
  updateCourse: async (id, course) => {
    await updateCourse(id, course)
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...course } : c)),
    }))
  },
  deleteCourse: async (id) => {
    await deleteCourse(id)
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    }))
  },

  // Lessons
  addLesson: async (courseId, lesson) => {
    const id = await addLesson(courseId, lesson)
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            lessons: [...(c.lessons || []), { id, ...lesson }],
          }
        }
        return c
      }),
    }))
    return id
  },
  updateLesson: async (courseId, lessonId, lesson) => {
    await updateLesson(courseId, lessonId, lesson)
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            lessons: c.lessons?.map((l) => (l.id === lessonId ? { ...l, ...lesson } : l)),
          }
        }
        return c
      }),
    }))
  },
  deleteLesson: async (courseId, lessonId) => {
    await deleteLesson(courseId, lessonId)
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            lessons: c.lessons?.filter((l) => l.id !== lessonId),
          }
        }
        return c
      }),
    }))
  },

  // Attachments
  addAttachment: async (courseId, lessonId, attachment) => {
    const id = await addAttachment(courseId, lessonId, attachment)
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            lessons: c.lessons?.map((l) => {
              if (l.id === lessonId) {
                return {
                  ...l,
                  attachments: [...(l.attachments || []), { id, ...attachment }],
                }
              }
              return l
            }),
          }
        }
        return c
      }),
    }))
    return id
  },
  deleteAttachment: async (courseId, lessonId, attachmentId) => {
    await deleteAttachment(courseId, lessonId, attachmentId)
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            lessons: c.lessons?.map((l) => {
              if (l.id === lessonId) {
                return {
                  ...l,
                  attachments: l.attachments?.filter((a) => a.id !== attachmentId),
                }
              }
              return l
            }),
          }
        }
        return c
      }),
    }))
  },

  // Enrollments
  enrolledCourses: [],
  enrollInCourse: async (userId, courseId) => {
    await enrollUserInCourse(userId, courseId)
    set((state) => ({
      enrolledCourses: [...state.enrolledCourses, courseId],
    }))
  },
  unenrollFromCourse: async (userId, courseId) => {
    await unenrollUserFromCourse(userId, courseId)
    set((state) => ({
      enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
    }))
  },
  fetchEnrolledCourses: async (userId) => {
    const enrollments = await getUserEnrollments(userId)
    set({ enrolledCourses: enrollments || [] })
  },

  // Progress
  courseProgress: {},
  markLessonCompleted: async (userId, courseId, lessonId, completed) => {
    await updateLessonProgress(userId, courseId, lessonId, completed)

    // Update local state
    set((state) => {
      const courseProgressCopy = { ...state.courseProgress }

      if (!courseProgressCopy[courseId]) {
        courseProgressCopy[courseId] = {}
      }

      if (!courseProgressCopy[courseId][lessonId]) {
        courseProgressCopy[courseId][lessonId] = { completed: false }
      }

      courseProgressCopy[courseId][lessonId].completed = completed

      return { courseProgress: courseProgressCopy }
    })
  },
  fetchCourseProgress: async (userId, courseId) => {
    const progress = await getUserCourseProgress(userId, courseId)

    set((state) => {
      const courseProgressCopy = { ...state.courseProgress }
      courseProgressCopy[courseId] = progress || {}
      return { courseProgress: courseProgressCopy }
    })
  },

  // Notes
  notes: {},
  addNote: async (userId, courseId, lessonId, content) => {
    const noteId = await addNote(userId, courseId, lessonId, content)

    set((state) => {
      const notesCopy = { ...state.notes }

      if (!notesCopy[courseId]) {
        notesCopy[courseId] = {}
      }

      if (!notesCopy[courseId][lessonId]) {
        notesCopy[courseId][lessonId] = {}
      }

      notesCopy[courseId][lessonId][noteId] = {
        id: noteId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return { notes: notesCopy }
    })

    return noteId
  },
  updateNote: async (userId, courseId, lessonId, noteId, content) => {
    await updateNote(userId, courseId, lessonId, noteId, content)

    set((state) => {
      const notesCopy = { ...state.notes }

      if (notesCopy[courseId] && notesCopy[courseId][lessonId] && notesCopy[courseId][lessonId][noteId]) {
        notesCopy[courseId][lessonId][noteId] = {
          ...notesCopy[courseId][lessonId][noteId],
          content,
          updatedAt: new Date().toISOString(),
        }
      }

      return { notes: notesCopy }
    })
  },
  deleteNote: async (userId, courseId, lessonId, noteId) => {
    await deleteNote(userId, courseId, lessonId, noteId)

    set((state) => {
      const notesCopy = { ...state.notes }

      if (notesCopy[courseId] && notesCopy[courseId][lessonId] && notesCopy[courseId][lessonId][noteId]) {
        const { [noteId]: _, ...restNotes } = notesCopy[courseId][lessonId]
        notesCopy[courseId][lessonId] = restNotes
      }

      return { notes: notesCopy }
    })
  },
  fetchNotes: async (userId, courseId, lessonId) => {
    const notes = await getUserNotes(userId, courseId, lessonId)

    set((state) => {
      const notesCopy = { ...state.notes }

      if (!notesCopy[courseId]) {
        notesCopy[courseId] = {}
      }

      notesCopy[courseId][lessonId] = notes || {}

      return { notes: notesCopy }
    })
  },
}))
