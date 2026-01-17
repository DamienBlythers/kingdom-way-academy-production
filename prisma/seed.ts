import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create test users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@kingdomwayacademy.com" },
    update: {},
    create: {
      email: "admin@kingdomwayacademy.com",
      name: "Admin User",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const instructorUser = await prisma.user.upsert({
    where: { email: "instructor@kingdomwayacademy.com" },
    update: {},
    create: {
      email: "instructor@kingdomwayacademy.com",
      name: "Dr. Sarah Johnson",
      role: "INSTRUCTOR",
      emailVerified: new Date(),
    },
  });

  const learnerUser = await prisma.user.upsert({
    where: { email: "learner@kingdomwayacademy.com" },
    update: {},
    create: {
      email: "learner@kingdomwayacademy.com",
      name: "John Smith",
      role: "LEARNER",
      emailVerified: new Date(),
      subscriptionStatus: "ACTIVE",
    },
  });

  console.log("✅ Created users:", { adminUser, instructorUser, learnerUser });

  // Create sample course
  const course = await prisma.course.upsert({
    where: { slug: "biblical-leadership-foundations" },
    update: {},
    create: {
      title: "Biblical Leadership Foundations",
      slug: "biblical-leadership-foundations",
      description:
        "Discover timeless leadership principles from Scripture. Learn how biblical leaders like Moses, David, and Paul navigated challenges and inspired their people. This course combines theological depth with practical application for modern leaders.",
      status: "PUBLISHED",
      price: 0, // Free course
      instructorId: instructorUser.id,
      publishedAt: new Date(),
    },
  });

  console.log("✅ Created course:", course);

  // Create modules
  const module1 = await prisma.module.create({
    data: {
      title: "Introduction to Biblical Leadership",
      description: "Understanding leadership through a biblical lens",
      order: 1,
      courseId: course.id,
    },
  });

  const module2 = await prisma.module.create({
    data: {
      title: "Character of a Godly Leader",
      description: "Developing integrity, humility, and servant-heartedness",
      order: 2,
      courseId: course.id,
    },
  });

  const module3 = await prisma.module.create({
    data: {
      title: "Leadership in Action",
      description: "Practical application of biblical principles",
      order: 3,
      courseId: course.id,
    },
  });

  console.log("✅ Created modules");

  // Create lessons for Module 1
  const lesson1 = await prisma.lesson.create({
    data: {
      title: "What is Biblical Leadership?",
      content: `
        <h2>Understanding Biblical Leadership</h2>
        <p>Biblical leadership is fundamentally different from worldly leadership. While the world defines leadership by power, position, and personal achievement, biblical leadership is rooted in service, humility, and glorifying God.</p>
        
        <h3>Key Principles:</h3>
        <ul>
          <li><strong>Servant Leadership:</strong> Jesus modeled this perfectly - "The Son of Man came not to be served but to serve" (Matthew 20:28)</li>
          <li><strong>Stewardship:</strong> Leaders are stewards of God's resources and people, accountable to Him</li>
          <li><strong>Character First:</strong> Who you are matters more than what you accomplish</li>
          <li><strong>Purpose-Driven:</strong> Leadership exists to fulfill God's purposes, not personal ambitions</li>
        </ul>

        <h3>Reflection Questions:</h3>
        <ol>
          <li>How does your current leadership style compare to biblical principles?</li>
          <li>What areas need transformation?</li>
          <li>Who is a biblical leader you admire and why?</li>
        </ol>
      `,
      videoUrl: "https://example.com/videos/lesson1.mp4", // Replace with real video URL
      duration: 900, // 15 minutes
      order: 1,
      moduleId: module1.id,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: "Moses: Leading Through Uncertainty",
      content: `
        <h2>Moses: A Case Study in Faithful Leadership</h2>
        <p>Moses' journey from prince to shepherd to deliverer teaches us powerful lessons about leadership in uncertain times.</p>
        
        <h3>Key Lessons from Moses:</h3>
        <ul>
          <li><strong>Humility:</strong> Despite his education and position, Moses learned humility in the wilderness</li>
          <li><strong>Dependence on God:</strong> His constant communication with God sustained his leadership</li>
          <li><strong>Courage:</strong> Standing before Pharaoh required immense faith</li>
          <li><strong>Perseverance:</strong> 40 years in the wilderness tested his commitment</li>
        </ul>

        <blockquote>
          "The LORD replied, 'My Presence will go with you, and I will give you rest.'" - Exodus 33:14
        </blockquote>

        <h3>Application for Today:</h3>
        <p>When facing uncertainty in your leadership:</p>
        <ol>
          <li>Seek God's presence above all else</li>
          <li>Trust His timing, not your timeline</li>
          <li>Lead with humility, acknowledging your dependence on God</li>
        </ol>
      `,
      duration: 720, // 12 minutes
      order: 2,
      moduleId: module1.id,
    },
  });

  // Create quiz for lesson 1
  const quiz1 = await prisma.quiz.create({
    data: {
      title: "Biblical Leadership Foundations Quiz",
      description: "Test your understanding of biblical leadership principles",
      passingScore: 70,
      lessonId: lesson1.id,
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz1.id,
        question: "What is the primary focus of biblical leadership?",
        options: JSON.stringify([
          "Personal achievement and success",
          "Serving others and glorifying God",
          "Gaining power and influence",
          "Building wealth and prosperity",
        ]),
        correctAnswer: "Serving others and glorifying God",
        explanation:
          "Biblical leadership is fundamentally about serving others and bringing glory to God, not personal gain.",
        order: 1,
      },
      {
        quizId: quiz1.id,
        question: "According to Matthew 20:28, Jesus came to:",
        options: JSON.stringify([
          "Be served by others",
          "Rule as a king",
          "Serve and give His life as a ransom",
          "Establish an earthly kingdom",
        ]),
        correctAnswer: "Serve and give His life as a ransom",
        explanation:
          "Jesus explicitly stated He came to serve and give His life as a ransom for many.",
        order: 2,
      },
      {
        quizId: quiz1.id,
        question: "What does stewardship in leadership mean?",
        options: JSON.stringify([
          "Owning and controlling resources",
          "Managing God's resources with accountability",
          "Building personal wealth",
          "Leading without accountability",
        ]),
        correctAnswer: "Managing God's resources with accountability",
        explanation:
          "Stewardship recognizes that we are managers, not owners, and are accountable to God.",
        order: 3,
      },
    ],
  });

  console.log("✅ Created lessons and quiz");

  // Create lessons for Module 2
  await prisma.lesson.createMany({
    data: [
      {
        title: "Integrity: The Foundation of Trust",
        content:
          "<h2>Building Trust Through Integrity</h2><p>Integrity is doing the right thing even when no one is watching...</p>",
        duration: 600,
        order: 1,
        moduleId: module2.id,
      },
      {
        title: "Humility: Power Under Control",
        content:
          "<h2>The Strength of Humility</h2><p>True humility isn't thinking less of yourself, but thinking of yourself less...</p>",
        duration: 720,
        order: 2,
        moduleId: module2.id,
      },
      {
        title: "Servant-Heartedness in Daily Practice",
        content:
          "<h2>Living as a Servant Leader</h2><p>Practical ways to serve your team daily...</p>",
        duration: 540,
        order: 3,
        moduleId: module2.id,
      },
    ],
  });

  // Create lessons for Module 3
  await prisma.lesson.createMany({
    data: [
      {
        title: "Decision Making with Wisdom",
        content:
          "<h2>Biblical Decision Making</h2><p>How to seek God's wisdom in leadership decisions...</p>",
        duration: 660,
        order: 1,
        moduleId: module3.id,
      },
      {
        title: "Conflict Resolution God's Way",
        content:
          "<h2>Resolving Conflict Biblically</h2><p>Principles from Matthew 18 for handling disputes...</p>",
        duration: 780,
        order: 2,
        moduleId: module3.id,
      },
      {
        title: "Building and Leading Teams",
        content:
          "<h2>Team Leadership Principles</h2><p>Creating unified, purpose-driven teams...</p>",
        duration: 840,
        order: 3,
        moduleId: module3.id,
      },
    ],
  });

  console.log("✅ Created all lessons");

  // Create enrollment for test learner
  await prisma.enrollment.create({
    data: {
      userId: learnerUser.id,
      courseId: course.id,
      progress: 15,
    },
  });

  // Create some progress for the learner
  await prisma.lessonProgress.create({
    data: {
      userId: learnerUser.id,
      lessonId: lesson1.id,
      completed: true,
      completedAt: new Date(),
    },
  });

  console.log("✅ Created enrollment and progress");

  // Create additional courses
  await prisma.course.createMany({
    data: [
      {
        title: "Faith in the Workplace",
        slug: "faith-in-the-workplace",
        description:
          "Integrating Christian values in professional settings. Learn how to be salt and light in your workplace.",
        status: "PUBLISHED",
        price: 0,
        instructorId: instructorUser.id,
        publishedAt: new Date(),
      },
      {
        title: "Spiritual Growth & Discipline",
        slug: "spiritual-growth-discipline",
        description:
          "Building lasting habits for spiritual maturity. Develop consistent prayer, Bible study, and worship practices.",
        status: "PUBLISHED",
        price: 0,
        instructorId: instructorUser.id,
        publishedAt: new Date(),
      },
    ],
  });

  console.log("✅ Created additional courses");
  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });