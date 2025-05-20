// This file re-exports functionality from firebase-client.ts
// to maintain backward compatibility with existing code

import {
  auth,
  db,
  storage,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  updatePassword,
  getUserProfile,
  getUserEnrollments,
} from "./firebase-client"

// Re-export everything
export {
  auth,
  db,
  storage,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  updatePassword,
  getUserProfile,
  getUserEnrollments,
}

// Auth state change listener
export const onAuthStateChange = async (callback: (user: any) => void) => {
  const { onAuthStateChanged } = await import("firebase/auth")
  return onAuthStateChanged(auth, callback)
}

// For backward compatibility
export const createUserWithEmail = signUpWithEmail

export const signInWithGoogle = async () => {
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export const createUserProfile = async (userId: string, data: any) => {
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")
  const userRef = doc(db, "users", userId)
  return setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export const updateUserProfile = async (userId: string, data: any) => {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
  const userRef = doc(db, "users", userId)
  return updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const signOutUser = signOut

// Course functions
export const getCourse = async (courseId: string) => {
  const { doc, getDoc, collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

  // First, get the course document
  const courseRef = doc(db, "courses", courseId)
  const courseSnap = await getDoc(courseRef)

  if (!courseSnap.exists()) {
    return null
  }

  const courseData = courseSnap.data()

  // Next, get the lessons for this course
  const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", courseId), orderBy("order", "asc"))
  const lessonsSnapshot = await getDocs(lessonsQuery)
  const lessons = await Promise.all(
    lessonsSnapshot.docs.map(async (lessonDoc) => {
      const lessonData = lessonDoc.data()

      // Get attachments for this lesson
      const attachmentsQuery = query(collection(db, "attachments"), where("lessonId", "==", lessonDoc.id))
      const attachmentsSnapshot = await getDocs(attachmentsQuery)
      const attachments = attachmentsSnapshot.docs.map((attachDoc) => ({
        id: attachDoc.id,
        ...attachDoc.data(),
      }))

      return {
        id: lessonDoc.id,
        ...lessonData,
        attachments,
      }
    }),
  )

  return {
    id: courseSnap.id,
    ...courseData,
    lessons,
  }
}

export const getCourses = async () => {
  const { collection, getDocs, query, where, orderBy } = await import("firebase/firestore")

  try {
    const coursesQuery = query(collection(db, "courses"))
    const querySnapshot = await getDocs(coursesQuery)

    if (querySnapshot.empty) {
      return []
    }

    const courses = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const courseData = doc.data()

        // Get lesson count
        const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", doc.id))
        const lessonsSnapshot = await getDocs(lessonsQuery)

        // Get student count
        const enrollmentQuery = query(collection(db, "enrollments"), where("courseId", "==", doc.id))
        const enrollmentSnapshot = await getDocs(enrollmentQuery)

        return {
          id: doc.id,
          ...courseData,
          lessons: lessonsSnapshot.docs.map((lessonDoc) => ({
            id: lessonDoc.id,
            ...lessonDoc.data(),
          })),
          students: enrollmentSnapshot.size,
        }
      }),
    )

    return courses
  } catch (error) {
    console.error("Error getting courses:", error)
    return []
  }
}

export const getInstructorCourses = async (instructorId: string) => {
  const { collection, query, where, getDocs } = await import("firebase/firestore")

  const coursesQuery = query(collection(db, "courses"), where("instructorId", "==", instructorId))
  const querySnapshot = await getDocs(coursesQuery)

  return Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const courseData = doc.data()

      // Get lesson count
      const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", doc.id))
      const lessonsSnapshot = await getDocs(lessonsQuery)

      // Get student count
      const enrollmentQuery = query(collection(db, "enrollments"), where("courseId", "==", doc.id))
      const enrollmentSnapshot = await getDocs(enrollmentQuery)

      return {
        id: doc.id,
        ...courseData,
        lessons: lessonsSnapshot.docs.map((lessonDoc) => ({
          id: lessonDoc.id,
          ...lessonDoc.data(),
        })),
        students: enrollmentSnapshot.size,
      }
    }),
  )
}

// Lesson functions
export const createLesson = async (courseId: string, lessonData: any) => {
  const { collection, addDoc, query, where, getDocs, serverTimestamp } = await import("firebase/firestore")

  const lessonsRef = collection(db, "lessons")

  // Get current lesson count to determine order
  const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", courseId))
  const lessonsSnapshot = await getDocs(lessonsQuery)
  const order = lessonsSnapshot.size

  const docRef = await addDoc(lessonsRef, {
    ...lessonData,
    courseId,
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export const addLesson = createLesson

export const updateLesson = async (lessonId: string, lessonData: any) => {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

  const lessonRef = doc(db, "lessons", lessonId)
  await updateDoc(lessonRef, {
    ...lessonData,
    updatedAt: serverTimestamp(),
  })
}

export const deleteLesson = async (lessonId: string) => {
  const { doc, deleteDoc, collection, query, where, getDocs } = await import("firebase/firestore")

  // Delete the lesson
  const lessonRef = doc(db, "lessons", lessonId)
  await deleteDoc(lessonRef)

  // Delete related attachments
  const attachmentsQuery = query(collection(db, "attachments"), where("lessonId", "==", lessonId))
  const attachmentsSnapshot = await getDocs(attachmentsQuery)
  attachmentsSnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "attachments", document.id))
  })

  // Delete related progress
  const progressQuery = query(collection(db, "progress"), where("lessonId", "==", lessonId))
  const progressSnapshot = await getDocs(progressQuery)
  progressSnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "progress", document.id))
  })
}

// Attachment functions
export const addAttachment = async (lessonId: string, attachment: any) => {
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

  const attachmentsRef = collection(db, "attachments")
  const docRef = await addDoc(attachmentsRef, {
    ...attachment,
    lessonId,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const deleteAttachment = async (attachmentId: string) => {
  const { doc, deleteDoc } = await import("firebase/firestore")

  const attachmentRef = doc(db, "attachments", attachmentId)
  await deleteDoc(attachmentRef)
}

// Course enrollment functions
export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const { collection, query, where, getDocs, addDoc, serverTimestamp } = await import("firebase/firestore")

  // Check if already enrolled
  const enrollmentQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    where("courseId", "==", courseId),
  )
  const querySnapshot = await getDocs(enrollmentQuery)

  if (querySnapshot.empty) {
    const enrollmentRef = collection(db, "enrollments")
    await addDoc(enrollmentRef, {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
    })
  }
}

export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  const { collection, query, where, getDocs, doc, deleteDoc } = await import("firebase/firestore")

  const enrollmentQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    where("courseId", "==", courseId),
  )

  const querySnapshot = await getDocs(enrollmentQuery)
  querySnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "enrollments", document.id))
  })

  // Also delete related progress
  const progressQuery = query(
    collection(db, "progress"),
    where("userId", "==", userId),
    where("courseId", "==", courseId),
  )
  const progressSnapshot = await getDocs(progressQuery)
  progressSnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "progress", document.id))
  })
}

// Course progress functions
export const updateLessonProgress = async (userId: string, courseId: string, lessonId: string, completed: boolean) => {
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")

  // Create a unique ID for the progress document
  const progressId = `${userId}_${courseId}_${lessonId}`
  const progressRef = doc(db, "progress", progressId)

  await setDoc(
    progressRef,
    {
      userId,
      courseId,
      lessonId,
      completed,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const getUserCourseProgress = async (userId: string, courseId: string) => {
  const { collection, query, where, getDocs } = await import("firebase/firestore")

  const progressQuery = query(
    collection(db, "progress"),
    where("userId", "==", userId),
    where("courseId", "==", courseId),
  )

  const querySnapshot = await getDocs(progressQuery)
  const progress: Record<string, { completed: boolean }> = {}

  querySnapshot.forEach((doc) => {
    const data = doc.data()
    progress[data.lessonId] = { completed: data.completed }
  })

  return progress
}

export const getAllUserProgress = async (userId: string) => {
  const { collection, query, where, getDocs } = await import("firebase/firestore")

  const progressQuery = query(collection(db, "progress"), where("userId", "==", userId), where("completed", "==", true))

  const querySnapshot = await getDocs(progressQuery)
  return querySnapshot.docs.map((doc) => doc.data())
}

// Notes functions
export const getUserNotes = async (userId: string, courseId?: string) => {
  const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

  let notesQuery

  if (courseId) {
    notesQuery = query(
      collection(db, "notes"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      orderBy("createdAt", "desc"),
    )
  } else {
    notesQuery = query(collection(db, "notes"), where("userId", "==", userId), orderBy("createdAt", "desc"))
  }

  const querySnapshot = await getDocs(notesQuery)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  }))
}

export const createNote = async (noteData: any) => {
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

  const notesRef = collection(db, "notes")
  const docRef = await addDoc(notesRef, {
    ...noteData,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const addNote = createNote

export const updateNote = async (noteId: string, content: string) => {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

  const noteRef = doc(db, "notes", noteId)
  await updateDoc(noteRef, {
    content,
    updatedAt: serverTimestamp(),
  })
}

export const deleteNote = async (noteId: string) => {
  const { doc, deleteDoc } = await import("firebase/firestore")

  const noteRef = doc(db, "notes", noteId)
  await deleteDoc(noteRef)
}

// Recent activity functions
export const getUserRecentActivity = async (userId: string, limit = 5) => {
  const {
    collection,
    query,
    where,
    orderBy,
    limit: limitQuery,
    getDocs,
    doc,
    getDoc,
  } = await import("firebase/firestore")

  // Get recent notes
  const notesQuery = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limitQuery(limit),
  )

  const notesSnapshot = await getDocs(notesQuery)
  const notes = notesSnapshot.docs.map((doc) => ({
    type: "note",
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().createdAt?.toDate?.() || new Date(),
  }))

  // Get recent enrollments
  const enrollmentsQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    orderBy("enrolledAt", "desc"),
    limitQuery(limit),
  )

  const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
  const enrollments = await Promise.all(
    enrollmentsSnapshot.docs.map(async (doc) => {
      const courseId = doc.data().courseId
      const courseRef = doc(db, "courses", courseId)
      const courseSnap = await getDoc(courseRef)

      return {
        type: "enrollment",
        id: doc.id,
        courseId,
        courseTitle: courseSnap.exists() ? courseSnap.data().title : "Unknown course",
        timestamp: doc.data().enrolledAt?.toDate?.() || new Date(),
      }
    }),
  )

  // Get recent progress
  const progressQuery = query(
    collection(db, "progress"),
    where("userId", "==", userId),
    where("completed", "==", true),
    orderBy("updatedAt", "desc"),
    limitQuery(limit),
  )

  const progressSnapshot = await getDocs(progressQuery)
  const progress = await Promise.all(
    progressSnapshot.docs.map(async (doc) => {
      const data = doc.data()
      const lessonRef = doc(db, "lessons", data.lessonId)
      const lessonSnap = await getDoc(lessonRef)

      return {
        type: "progress",
        id: doc.id,
        courseId: data.courseId,
        lessonId: data.lessonId,
        lessonTitle: lessonSnap.exists() ? lessonSnap.data().title : "Unknown lesson",
        timestamp: data.updatedAt?.toDate?.() || new Date(),
      }
    }),
  )

  // Combine and sort by timestamp
  return [...notes, ...enrollments, ...progress]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

// Verification functions
export const isUserEnrolledInCourse = async (userId: string, courseId: string): Promise<boolean> => {
  if (!userId || !courseId) return false

  try {
    const enrollments = await getUserEnrollments(userId)
    return enrollments.includes(courseId)
  } catch (error) {
    console.error("Error checking enrollment:", error)
    return false
  }
}

// Course functions
export const createCourse = async (userId: string, courseData: any) => {
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

  const coursesRef = collection(db, "courses")
  const docRef = await addDoc(coursesRef, {
    ...courseData,
    instructorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const addCourse = createCourse

export const updateCourse = async (courseId: string, courseData: any) => {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

  const courseRef = doc(db, "courses", courseId)
  await updateDoc(courseRef, {
    ...courseData,
    updatedAt: serverTimestamp(),
  })
}

export const deleteCourse = async (courseId: string) => {
  const { doc, deleteDoc, collection, query, where, getDocs } = await import("firebase/firestore")

  // Delete the course document
  const courseRef = doc(db, "courses", courseId)
  await deleteDoc(courseRef)

  // Also delete related data (lessons, enrollments, progress)
  const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", courseId))
  const lessonsSnapshot = await getDocs(lessonsQuery)
  lessonsSnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "lessons", document.id))
  })

  const enrollmentsQuery = query(collection(db, "enrollments"), where("courseId", "==", courseId))
  const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
  enrollmentsSnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "enrollments", document.id))
  })

  const progressQuery = query(collection(db, "progress"), where("courseId", "==", courseId))
  const progressSnapshot = await getDocs(progressQuery)
  progressSnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "progress", document.id))
  })
}

// Password reset functions
export const sendPasswordResetRequest = async (email: string) => {
  const { sendPasswordResetEmail } = await import("firebase/auth")
  return sendPasswordResetEmail(auth, email)
}

export const verifyPasswordResetToken = async (actionCode: string) => {
  const { verifyPasswordResetCode } = await import("firebase/auth")
  return verifyPasswordResetCode(auth, actionCode)
}

export const completePasswordReset = async (actionCode: string, newPassword: string) => {
  const { confirmPasswordReset } = await import("firebase/auth")
  return confirmPasswordReset(auth, actionCode, newPassword)
}
