export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorId?: string
  level: string
  duration: string
  image: string
  students: number
  certificate: boolean
  lessons: Lesson[]
  createdAt?: any
  updatedAt?: any
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  videoUrl: string
  courseId?: string
  order?: number
  attachments?: Attachment[]
  timestamps?: Timestamp[]
  createdAt?: any
  updatedAt?: any
}

export interface Timestamp {
  id: string
  title: string
  description?: string
  time: number // in seconds
  lessonId?: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: string
  lessonId?: string
  createdAt?: any
}

export interface Note {
  id: string
  content: string
  userId: string
  courseId: string
  createdAt: any
  updatedAt?: any
}

export interface Progress {
  userId: string
  courseId: string
  lessonId: string
  completed: boolean
  updatedAt: any
}

export interface Enrollment {
  userId: string
  courseId: string
  enrolledAt: any
}

export interface User {
  id: string
  displayName: string
  email: string
  role: "student" | "instructor" | "admin"
  createdAt: any
}

export interface UserProfile {
  displayName?: string
  email?: string
  photoURL?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    facebook?: string
  }
  role?: "student" | "instructor" | "admin"
  interests?: string[]
  skills?: string[]
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    from: any
    to: any
  }[]
  experience?: {
    company: string
    position: string
    from: any
    to: any
    current: boolean
    description: string
  }[]
  createdAt?: any
  updatedAt?: any
}
