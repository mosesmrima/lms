"use client"

import { createUserWithEmail, createUserProfile, createCourse, createLesson, addAttachment } from "./firebase"

// Sample instructor account
const instructorAccount = {
  email: "instructor@example.com",
  password: "password123",
  displayName: "John Instructor",
  role: "instructor",
}

// Sample courses data
const coursesData = [
  {
    title: "Introduction to Cybersecurity",
    description:
      "Learn the fundamentals of cybersecurity, including key concepts, common threats, and basic protection strategies.",
    imageUrl: "/cybersecurity-network.png",
    category: "Fundamentals",
    level: "Beginner",
    duration: "4 weeks",
    price: 49.99,
    lessons: [
      {
        title: "Understanding Cybersecurity Basics",
        description: "An introduction to key cybersecurity concepts and terminology.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "45 minutes",
        attachments: [
          {
            name: "Cybersecurity Basics Cheatsheet",
            url: "https://example.com/cheatsheet.pdf",
            type: "pdf",
          },
        ],
      },
      {
        title: "Common Cyber Threats",
        description: "Explore the most common types of cyber threats and attacks.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "50 minutes",
        attachments: [
          {
            name: "Threat Classification Guide",
            url: "https://example.com/threats.pdf",
            type: "pdf",
          },
        ],
      },
      {
        title: "Basic Protection Strategies",
        description: "Learn fundamental strategies to protect yourself and your organization.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "55 minutes",
        attachments: [
          {
            name: "Protection Checklist",
            url: "https://example.com/checklist.pdf",
            type: "pdf",
          },
        ],
      },
    ],
  },
  {
    title: "Network Security Fundamentals",
    description:
      "Understand how to secure networks, implement firewalls, and protect against common network-based attacks.",
    imageUrl: "/network-security-concept.png",
    category: "Network Security",
    level: "Intermediate",
    duration: "6 weeks",
    price: 79.99,
    lessons: [
      {
        title: "Network Architecture and Security",
        description: "Understanding network architecture from a security perspective.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "60 minutes",
        attachments: [
          {
            name: "Network Architecture Diagram",
            url: "https://example.com/network.pdf",
            type: "pdf",
          },
        ],
      },
      {
        title: "Firewall Implementation",
        description: "How to implement and configure firewalls for optimal security.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "65 minutes",
        attachments: [
          {
            name: "Firewall Configuration Guide",
            url: "https://example.com/firewall.pdf",
            type: "pdf",
          },
        ],
      },
    ],
  },
  {
    title: "Ethical Hacking",
    description:
      "Learn ethical hacking techniques to identify and fix security vulnerabilities in systems and networks.",
    imageUrl: "/ethical-hacking.png",
    category: "Offensive Security",
    level: "Advanced",
    duration: "8 weeks",
    price: 99.99,
    lessons: [
      {
        title: "Introduction to Ethical Hacking",
        description: "Understanding the role and responsibilities of an ethical hacker.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "50 minutes",
        attachments: [
          {
            name: "Ethical Hacking Methodology",
            url: "https://example.com/methodology.pdf",
            type: "pdf",
          },
        ],
      },
      {
        title: "Reconnaissance Techniques",
        description: "Learn how to gather information about target systems and networks.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "55 minutes",
        attachments: [
          {
            name: "Reconnaissance Tools Guide",
            url: "https://example.com/recon.pdf",
            type: "pdf",
          },
        ],
      },
      {
        title: "Vulnerability Assessment",
        description: "Techniques for identifying and assessing security vulnerabilities.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "60 minutes",
        attachments: [
          {
            name: "Vulnerability Assessment Checklist",
            url: "https://example.com/vulns.pdf",
            type: "pdf",
          },
        ],
      },
    ],
  },
]

export async function seedDatabase() {
  try {
    // Create instructor account
    const userCredential = await createUserWithEmail(
      instructorAccount.email,
      instructorAccount.password,
      instructorAccount.displayName,
    )
    const instructorId = userCredential.user.uid

    // Create instructor profile
    await createUserProfile(instructorId, {
      displayName: instructorAccount.displayName,
      email: instructorAccount.email,
      role: instructorAccount.role,
    })

    // Create courses
    for (const courseData of coursesData) {
      const { lessons, ...courseInfo } = courseData
      const courseId = await createCourse(instructorId, courseInfo)

      // Create lessons for each course
      for (const lessonData of lessons) {
        const { attachments, ...lessonInfo } = lessonData
        const lessonId = await createLesson(courseId, lessonInfo)

        // Add attachments for each lesson
        for (const attachmentData of attachments) {
          await addAttachment(lessonId, attachmentData)
        }
      }
    }

    return { success: true, instructorId }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: error.message }
  }
}
