import type { Course, Attachment } from "./types"

// Sample attachments for lessons
const sampleAttachments: Attachment[] = [
  {
    id: "att-1",
    name: "Course Syllabus.pdf",
    url: "https://example.com/syllabus.pdf",
    type: "pdf",
    size: "1.2 MB",
  },
  {
    id: "att-2",
    name: "Practice Exercises.pdf",
    url: "https://example.com/exercises.pdf",
    type: "pdf",
    size: "856 KB",
  },
  {
    id: "att-3",
    name: "Cheat Sheet.pdf",
    url: "https://example.com/cheatsheet.pdf",
    type: "pdf",
    size: "432 KB",
  },
  {
    id: "att-4",
    name: "Code Examples.zip",
    url: "https://example.com/code.zip",
    type: "archive",
    size: "3.4 MB",
  },
]

export const mockCourses: Course[] = [
  {
    id: "api-security",
    title: "API Security Fundamentals",
    description:
      "Learn how to secure APIs from common vulnerabilities and attacks. This course covers authentication, authorization, input validation, and other critical security concepts for API development.",
    instructor: "Jane Smith",
    level: "Intermediate",
    duration: "4 weeks",
    image: "/placeholder-hi16b.png",
    students: 342,
    certificate: true,
    lessons: [
      {
        id: "api-sec-1",
        title: "Introduction to API Security",
        description:
          "Overview of API security challenges and common attack vectors. In this lesson, you'll learn about the importance of API security in modern applications, the most common attack vectors targeting APIs, and the security implications of poorly designed APIs. We'll also discuss real-world API breaches and their impact on organizations.",
        duration: "45 min",
        videoUrl: "https://www.youtube.com/watch?v=t4UzXx5JHk0",
        attachments: [sampleAttachments[0], sampleAttachments[2]],
      },
      {
        id: "api-sec-2",
        title: "Authentication Mechanisms",
        description:
          "Implementing secure authentication for APIs. This lesson covers various authentication methods such as API keys, OAuth, JWT tokens, and how to implement them securely. We'll discuss the pros and cons of each approach and best practices for implementing authentication in your APIs.",
        duration: "60 min",
        videoUrl: "https://www.youtube.com/watch?v=GhK9jAhKVMU",
        attachments: [sampleAttachments[1]],
      },
      {
        id: "api-sec-3",
        title: "Authorization and Access Control",
        description:
          "Designing robust authorization models for APIs. Learn how to implement role-based access control (RBAC), attribute-based access control (ABAC), and other authorization patterns to ensure users can only access resources they're permitted to use.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=xKBGK6kyQJs",
        attachments: [sampleAttachments[3]],
      },
      {
        id: "api-sec-4",
        title: "Input Validation and Sanitization",
        description:
          "Preventing injection attacks through proper input handling. This lesson teaches you how to validate and sanitize input data to prevent injection attacks such as SQL injection, command injection, and other common vulnerabilities.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=OVf0xP_adz4",
      },
      {
        id: "api-sec-5",
        title: "Rate Limiting and Throttling",
        description:
          "Protecting APIs from abuse and DoS attacks. Learn how to implement rate limiting, throttling, and other defensive techniques to protect your APIs from abuse, denial of service attacks, and other forms of misuse.",
        duration: "40 min",
        videoUrl: "https://www.youtube.com/watch?v=VSFpIAK58Uk",
      },
    ],
  },
  {
    id: "blockchain-basics",
    title: "Blockchain Basics",
    description:
      "Understand the fundamentals of blockchain technology, including distributed ledgers, consensus mechanisms, and smart contracts. Learn how blockchain is applied in cybersecurity contexts.",
    instructor: "Michael Johnson",
    level: "Beginner",
    duration: "3 weeks",
    image: "/blockchain-network.png",
    students: 215,
    certificate: true,
    lessons: [
      {
        id: "blockchain-1",
        title: "What is Blockchain?",
        description:
          "Introduction to distributed ledger technology. This lesson provides a comprehensive overview of blockchain technology, including its history, key components, and how it works. We'll explore the concept of distributed ledgers and why they represent a paradigm shift in data management.",
        duration: "40 min",
        videoUrl: "https://www.youtube.com/watch?v=SSo_EIwHSd4",
        attachments: [sampleAttachments[0]],
      },
      {
        id: "blockchain-2",
        title: "Consensus Mechanisms",
        description:
          "Understanding Proof of Work, Proof of Stake, and other consensus algorithms. Learn how blockchain networks reach agreement on the state of the ledger, the energy implications of different consensus mechanisms, and the security considerations for each approach.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=MF2QgJoBCI0",
      },
      {
        id: "blockchain-3",
        title: "Smart Contracts",
        description:
          "Introduction to programmable contracts on the blockchain. Explore how smart contracts automate agreements and enable trustless transactions, with examples in Ethereum and other platforms. We'll cover the basics of smart contract development and security considerations.",
        duration: "60 min",
        videoUrl: "https://www.youtube.com/watch?v=ZE2HxTmxfrI",
        attachments: [sampleAttachments[3]],
      },
      {
        id: "blockchain-4",
        title: "Blockchain Security",
        description:
          "Security considerations in blockchain implementations. Learn about the security properties of blockchain systems, common vulnerabilities and attack vectors, and best practices for securing blockchain applications.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=VGHR6uhPvE8",
        attachments: [sampleAttachments[1], sampleAttachments[2]],
      },
    ],
  },
  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    description:
      "A comprehensive introduction to cybersecurity principles, threats, and defense strategies. Perfect for beginners looking to start a career in cybersecurity or improve their security awareness.",
    instructor: "David Williams",
    level: "Beginner",
    duration: "6 weeks",
    image: "/placeholder-qmol1.png",
    students: 578,
    certificate: true,
    lessons: [
      {
        id: "cyber-1",
        title: "Introduction to Cybersecurity",
        description:
          "Overview of the cybersecurity landscape and key concepts. This foundational lesson introduces the field of cybersecurity, key terminology, and the importance of security in the digital age. We'll discuss the CIA triad (Confidentiality, Integrity, Availability) and other fundamental security principles.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=inWWhr5tnEA",
        attachments: [sampleAttachments[0]],
      },
      {
        id: "cyber-2",
        title: "Common Cyber Threats",
        description:
          "Understanding malware, phishing, and social engineering. Learn about the various types of threats organizations face today, how they work, and their potential impact. We'll examine real-world examples and discuss how these attacks have evolved over time.",
        duration: "60 min",
        videoUrl: "https://www.youtube.com/watch?v=Dk-ZqQ-bfy4",
        attachments: [sampleAttachments[2]],
      },
      {
        id: "cyber-3",
        title: "Network Security Basics",
        description:
          "Fundamentals of securing networks and communications. This lesson covers the basics of network security, including firewalls, intrusion detection systems, VPNs, and secure network design principles. We'll also discuss common network attacks and mitigation strategies.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=E03gh1huvW4",
      },
      {
        id: "cyber-4",
        title: "Security Controls and Best Practices",
        description:
          "Implementing effective security controls. Learn about different types of security controls (preventive, detective, corrective) and how to implement a defense-in-depth strategy. We'll discuss industry frameworks and standards for security controls.",
        duration: "45 min",
        videoUrl: "https://www.youtube.com/watch?v=J1a1dZfLJWI",
        attachments: [sampleAttachments[1]],
      },
      {
        id: "cyber-5",
        title: "Incident Response",
        description:
          "Basics of responding to security incidents. This lesson teaches the fundamentals of incident response, including preparation, identification, containment, eradication, recovery, and lessons learned. We'll walk through a simulated incident response scenario.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=KXMLGKe_KZY",
        attachments: [sampleAttachments[3]],
      },
      {
        id: "cyber-6",
        title: "Security Awareness",
        description:
          "Building a security-conscious culture. Learn how to create and maintain a security awareness program that effectively educates employees and builds a strong security culture within an organization.",
        duration: "40 min",
        videoUrl: "https://www.youtube.com/watch?v=SDzjkKYJcCw",
      },
    ],
  },
  {
    id: "threat-intelligence",
    title: "Threat Intelligence 101",
    description:
      "Learn how to collect, analyze, and utilize threat intelligence to enhance your organization's security posture. This course covers threat intelligence sources, analysis methodologies, and practical applications.",
    instructor: "Sarah Thompson",
    level: "Intermediate",
    duration: "5 weeks",
    image: "/threat-intelligence-concept.png",
    students: 189,
    certificate: true,
    lessons: [
      {
        id: "threat-1",
        title: "Introduction to Threat Intelligence",
        description:
          "Understanding the role and importance of threat intelligence. This lesson introduces the concept of threat intelligence, its place in a modern security program, and how it can be used to enhance an organization's security posture.",
        duration: "45 min",
        videoUrl: "https://www.youtube.com/watch?v=S9QY62oVbz4",
        attachments: [sampleAttachments[0]],
      },
      {
        id: "threat-2",
        title: "Intelligence Sources and Collection",
        description:
          "Identifying and leveraging various intelligence sources. Learn about the different sources of threat intelligence, including open-source intelligence (OSINT), commercial feeds, information sharing communities, and internal telemetry data.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=ILeIZ3CR4m8",
        attachments: [sampleAttachments[2]],
      },
      {
        id: "threat-3",
        title: "Analysis Methodologies",
        description:
          "Techniques for analyzing and contextualizing threat data. This lesson covers various methodologies for analyzing threat intelligence, including the intelligence cycle, diamond model, and kill chain analysis. We'll practice applying these frameworks to real threat scenarios.",
        duration: "60 min",
        videoUrl: "https://www.youtube.com/watch?v=IQP_FPIXxQk",
        attachments: [sampleAttachments[1]],
      },
      {
        id: "threat-4",
        title: "Threat Intelligence Platforms",
        description:
          "Overview of tools for managing threat intelligence. Learn about the tools and platforms used to collect, process, analyze, and disseminate threat intelligence, including both commercial and open-source solutions.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=KRsHgLUkhNw",
      },
      {
        id: "threat-5",
        title: "Operationalizing Threat Intelligence",
        description:
          "Integrating threat intelligence into security operations. This lesson teaches how to effectively integrate threat intelligence into security operations, including SIEM integration, automation, and metrics for measuring the effectiveness of your threat intelligence program.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=c4K3m8Vp6G8",
        attachments: [sampleAttachments[3]],
      },
    ],
  },
  {
    id: "penetration-testing",
    title: "Penetration Testing Fundamentals",
    description:
      "Master the basics of ethical hacking and penetration testing. Learn methodologies, tools, and techniques used by security professionals to identify and exploit vulnerabilities in systems and applications.",
    instructor: "Alex Rodriguez",
    level: "Advanced",
    duration: "8 weeks",
    image: "/penetration-testing.png",
    students: 312,
    certificate: true,
    lessons: [
      {
        id: "pentest-1",
        title: "Introduction to Penetration Testing",
        description:
          "Understanding the role and ethics of penetration testing. This lesson covers the fundamentals of penetration testing, including methodology, scope, legal considerations, and ethical guidelines. We'll discuss the difference between penetration testing and other security assessments.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=3MSsBQ2hNgI",
        attachments: [sampleAttachments[0]],
      },
      {
        id: "pentest-2",
        title: "Reconnaissance Techniques",
        description:
          "Methods for gathering information about target systems. Learn about passive and active reconnaissance techniques, including OSINT, network scanning, and enumeration. We'll practice using various tools to gather information about target systems.",
        duration: "60 min",
        videoUrl: "https://www.youtube.com/watch?v=JHGrM8zcRMU",
        attachments: [sampleAttachments[3]],
      },
      {
        id: "pentest-3",
        title: "Vulnerability Scanning",
        description:
          "Using tools to identify potential vulnerabilities. This lesson covers vulnerability scanning tools and techniques, including how to interpret scan results and prioritize findings based on risk.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=WaL7bIai_5c",
        attachments: [sampleAttachments[1]],
      },
      {
        id: "pentest-4",
        title: "Exploitation Basics",
        description:
          "Understanding how to safely exploit vulnerabilities. Learn the basics of exploitation, including common vulnerability types, exploitation frameworks, and post-exploitation activities. We'll practice in a controlled lab environment.",
        duration: "65 min",
        videoUrl: "https://www.youtube.com/watch?v=s8mZtlXBcK4",
        attachments: [sampleAttachments[2]],
      },
      {
        id: "pentest-5",
        title: "Post-Exploitation",
        description:
          "Actions to take after gaining access to a system. This lesson covers post-exploitation activities, including privilege escalation, lateral movement, data exfiltration, and maintaining access. We'll discuss the ethical considerations of these activities.",
        duration: "60 min",
        videoUrl: "https://www.youtube.com/watch?v=S3BYPNxrZ6o",
      },
      {
        id: "pentest-6",
        title: "Reporting and Documentation",
        description:
          "Creating effective penetration testing reports. Learn how to document findings, create clear and actionable reports, and communicate results to technical and non-technical stakeholders.",
        duration: "45 min",
        videoUrl: "https://www.youtube.com/watch?v=Zq1J-QgQCLk",
        attachments: [sampleAttachments[0]],
      },
    ],
  },
  {
    id: "secure-coding",
    title: "Secure Coding Practices",
    description:
      "Learn how to write secure code and avoid common vulnerabilities. This course covers secure coding principles, common vulnerabilities like OWASP Top 10, and practical techniques for building secure applications.",
    instructor: "Emily Chen",
    level: "Intermediate",
    duration: "6 weeks",
    image: "/secure-coding.png",
    students: 245,
    certificate: true,
    lessons: [
      {
        id: "seccode-1",
        title: "Secure Coding Principles",
        description:
          "Fundamental principles for writing secure code. This lesson introduces the core principles of secure coding, including defense in depth, least privilege, and secure defaults. We'll discuss how these principles apply to different programming languages and environments.",
        duration: "45 min",
        videoUrl: "https://www.youtube.com/watch?v=qjrkV4RjgIU",
        attachments: [sampleAttachments[0], sampleAttachments[2]],
      },
      {
        id: "seccode-2",
        title: "Input Validation",
        description:
          "Techniques for properly validating user input. Learn how to implement robust input validation to prevent various injection attacks and other security vulnerabilities that arise from improperly validated input.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=f2C7_3J0ACA",
        attachments: [sampleAttachments[3]],
      },
      {
        id: "seccode-3",
        title: "Authentication and Session Management",
        description:
          "Implementing secure authentication and session handling. This lesson covers best practices for implementing authentication and session management, including password storage, multi-factor authentication, and session security.",
        duration: "60 min",
        videoUrl: "https://www.youtube.com/watch?v=vqtT0KyRiSw",
      },
      {
        id: "seccode-4",
        title: "Secure Database Access",
        description:
          "Preventing SQL injection and other database attacks. Learn how to implement secure database access patterns, prevent SQL injection, and protect sensitive data stored in databases.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=wHO46lGZZp0",
        attachments: [sampleAttachments[1]],
      },
      {
        id: "seccode-5",
        title: "Cross-Site Scripting Prevention",
        description:
          "Understanding and preventing XSS vulnerabilities. This lesson covers cross-site scripting (XSS) vulnerabilities, including how they work, how to identify them, and best practices for preventing them in different contexts.",
        duration: "55 min",
        videoUrl: "https://www.youtube.com/watch?v=KHwVjzWei1c",
      },
      {
        id: "seccode-6",
        title: "Secure DevOps Practices",
        description:
          "Integrating security into the development lifecycle. Learn how to integrate security into the software development lifecycle using DevSecOps practices, including automated security testing, dependency management, and secure deployment.",
        duration: "50 min",
        videoUrl: "https://www.youtube.com/watch?v=nrhxNNH5lt0",
        attachments: [sampleAttachments[0], sampleAttachments[3]],
      },
    ],
  },
]
