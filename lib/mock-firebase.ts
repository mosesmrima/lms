"use client"

// Mock Firebase implementation for development
import { mockCourses } from "./mock-data"
import type { Note } from "./types"

// Mock user data
const mockUsers = [
  {
    uid: "user1",
    email: "user@example.com",
    displayName: "Test User",
  },
]

// Mock auth state
let currentUser = null

// Mock auth functions
export async function signInWithEmail(email: string, password: string) {
  // Simulate authentication delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simple validation
  if (email === "user@example.com" && password === "password") {
    currentUser = mockUsers[0]
    return { user: currentUser }
  }

  throw new Error("Invalid email or password")
}

export async function createUserWithEmail(email: string, password: string) {
  // Simulate authentication delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Create a new mock user
  const newUser = {
    uid: `user${Date.now()}`,
    email,
    displayName: email.split("@")[0],
  }

  mockUsers.push(newUser)
  currentUser = newUser

  return { user: currentUser }
}

export async function signOutUser() {
  // Simulate authentication delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  currentUser = null
}

export async function onAuthStateChange(callback: (user: any) => void) {
  // Call the callback with the current user
  callback(currentUser)

  // Return a no-op unsubscribe function
  return () => {}
}

// Mock data storage
const mockStorage = {
  users: {},
  enrollments: [],
  notes: [],
  progress: {},
}

// Mock Firestore functions
export async function createUserProfile(userId: string, data: any) {
  mockStorage.users[userId] = { ...data, createdAt: new Date().toISOString() }
}

export async function getUserProfile(userId: string) {
  return mockStorage.users[userId] || null
}

export async function updateUserProfile(userId: string, data: any) {
  if (mockStorage.users[userId]) {
    mockStorage.users[userId] = { ...mockStorage.users[userId], ...data }
  }
}

export async function enrollUserInCourse(userId: string, courseId: string) {
  mockStorage.enrollments.push({
    userId,
    courseId,
    enrolledAt: new Date().toISOString(),
  })
}

export async function unenrollUserFromCourse(userId: string, courseId: string) {
  mockStorage.enrollments = mockStorage.enrollments.filter((e) => !(e.userId === userId && e.courseId === courseId))
}

export async function getUserEnrollments(userId: string) {
  return mockStorage.enrollments.filter((e) => e.userId === userId).map((e) => e.courseId)
}

export async function getUserNotes(userId: string, courseId?: string) {
  return mockStorage.notes.filter((n) => n.userId === userId && (!courseId || n.courseId === courseId))
}

export async function createNote(noteData: Omit<Note, "id">) {
  const id = `note${Date.now()}`
  const note = { ...noteData, id }
  mockStorage.notes.push(note)
  return id
}

export async function updateNote(noteId: string, content: string) {
  const noteIndex = mockStorage.notes.findIndex((n) => n.id === noteId)
  if (noteIndex >= 0) {
    mockStorage.notes[noteIndex].content = content
  }
}

export async function deleteNote(noteId: string) {
  mockStorage.notes = mockStorage.notes.filter((n) => n.id !== noteId)
}

export async function updateLessonProgress(userId: string, courseId: string, lessonId: string, completed: boolean) {
  const key = `${userId}_${courseId}_${lessonId}`
  mockStorage.progress[key] = {
    userId,
    courseId,
    lessonId,
    completed,
    updatedAt: new Date().toISOString(),
  }
}

export async function getUserCourseProgress(userId: string, courseId: string) {
  const progress: Record<string, { completed: boolean }> = {}

  Object.entries(mockStorage.progress).forEach(([key, value]) => {
    if (key.startsWith(`${userId}_${courseId}_`)) {
      const lessonId = key.split("_")[2]
      progress[lessonId] = { completed: value.completed }
    }
  })

  return progress
}

// Mock data functions
export async function getCourses() {
  return mockCourses
}

export async function getCourse(courseId: string) {
  return mockCourses.find((c) => c.id === courseId) || null
}
