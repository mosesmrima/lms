"use client"
import { Button } from "@heroui/react"
import { BenefitCard } from "@/components/benefit-card"
import { Shield, Award, Users } from "lucide-react"
import NextLink from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                  Master Cybersecurity Skills with AfricaHackon Academy
                </h1>
                <p className="max-w-[600px] text-gray-300 text-sm sm:text-base md:text-xl">
                  Join our community of security professionals and learn the latest techniques in cybersecurity,
                  penetration testing, and digital forensics.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button as={NextLink} href="/courses" color="primary" className="bg-primary hover:bg-[#d10021]">
                  Explore Courses
                </Button>
                <Button
                  as={NextLink}
                  href="/signin"
                  variant="bordered"
                  className="border-border text-white hover:border-primary"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="flex justify-center mt-6 lg:mt-0">
              <Image
                src="/cybersecurity-illustration.png"
                alt="Cybersecurity Illustration"
                width={500}
                height={400}
                className="rounded-lg w-full max-w-[400px] lg:max-w-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-content">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Why Choose AfricaHackon Academy</h2>
            <p className="text-gray-300 mt-2">Accelerate your cybersecurity career with our expert-led courses</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <BenefitCard
              icon={<Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
              title="Learn New Skills"
              description="Master practical cybersecurity skills with hands-on labs and real-world scenarios"
            />
            <BenefitCard
              icon={<Award className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
              title="Earn Rewards"
              description="Gain certificates and badges as you complete courses and challenges"
            />
            <BenefitCard
              icon={<Users className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
              title="Join a Community"
              description="Connect with like-minded security professionals and mentors"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Start Your Cybersecurity Journey?</h2>
            <p className="text-gray-300 max-w-[600px] text-sm sm:text-base">
              Join thousands of students who have advanced their careers with AfricaHackon Academy
            </p>
            <Button as={NextLink} href="/courses" color="primary" className="mt-4 bg-primary hover:bg-[#d10021]">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
