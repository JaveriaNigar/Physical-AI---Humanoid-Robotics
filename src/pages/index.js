import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import { AuthModal } from '../components/AuthModal';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            🤖 Physical AI & Humanoid Robotics
          </h1>
          <p className={styles.heroSubtitle}>
            Free, Open-Source Textbook for Building AI-Powered Humanoid Robots
          </p>
          <p className={styles.heroDescription}>
            Learn the engineering fundamentals of humanoid robotics: kinematics, dynamics,
            simulation, vision-language models, and real-world deployment.
            From theory to hands-on implementation.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={styles.primaryButton}
              to="/docs/chapters/ch0-preface">
              📖 Start Reading
            </Link>
            <Link
              className={styles.secondaryButton}
              to="https://github.com/JaveriaNigar/Physical-AI---Humanoid-Robotics">
              ⭐ View on GitHub
            </Link>
          </div>
          {/* <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          /> */}
          <div className={styles.createdBy}>
            <p>
              Created by <strong>Javeria Nigar</strong> for the <strong>GIAIC Community</strong><br/>
              <em>Free educational resource for the hackathon and beyond</em>
            </p>
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.robot}>
            🤖
          </div>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: '📚 6 Comprehensive Chapters',
      description: 'From introduction to advanced capstone projects. Cover kinematics, dynamics, simulation, and AI integration.',
      icon: '📖',
    },
    {
      title: '💻 Hands-On Code Examples',
      description: 'Python, ROS 2, Gazebo, and PyTorch examples you can run immediately. Learn by doing.',
      icon: '💻',
    },
    {
      title: '🎓 Industry-Ready Content',
      description: 'Based on latest research and real-world robotics platforms like Tesla Optimus.',
      icon: '🎓',
    },
    {
      title: '🚀 From Simulation to Real Hardware',
      description: 'Domain randomization, sim-to-real transfer, and practical deployment strategies.',
      icon: '🚀',
    },
    {
      title: '🧠 Vision-Language-Action Systems',
      description: 'Ground LLMs (Llama 3) and vision models (CLIP) to robot trajectories safely.',
      icon: '🧠',
    },
    {
      title: '🏆 Hackathon-Focused',
      description: 'Designed for rapid learning and competition. Compete, build, and ship.',
      icon: '🏆',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <h2>Why This Textbook?</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChaptersPreview() {
  const chapters = [
    {
      number: '0',
      title: 'Prerequisites & Notation',
      desc: 'Mathematical notation, linear algebra, and physics fundamentals.',
    },
    {
      number: '1',
      title: 'Introduction to Physical AI',
      desc: 'Why humanoid robots matter. Historical context and current state-of-the-art.',
    },
    {
      number: '2',
      title: 'Humanoid Basics',
      desc: 'Kinematics, dynamics, actuators, and sensing. Build intuition with equations.',
    },
    {
      number: '3',
      title: 'ROS 2 & Control',
      desc: 'Real-time operating system for robots. Publish-subscribe communication.',
    },
    {
      number: '4',
      title: 'Digital Twin Simulation',
      desc: 'Gazebo, URDF, physics engines, and sim-to-real transfer.',
    },
    {
      number: '5',
      title: 'Vision-Language-Action',
      desc: 'Ground LLMs to robot actions. CLIP + Llama 3 + safety constraints.',
    },
    {
      number: '6',
      title: 'Capstone AI-Robot Pipeline',
      desc: 'End-to-end system: perception → planning → control → execution.',
    },
  ];

  return (
    <section className={styles.chaptersSection}>
      <div className={styles.container}>
        <h2>📖 Chapter Overview</h2>
        <div className={styles.chaptersGrid}>
          {chapters.map((chapter, idx) => (
            <div key={idx} className={styles.chapterCard}>
              <div className={styles.chapterNumber}>Ch {chapter.number}</div>
              <h3>{chapter.title}</h3>
              <p>{chapter.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.quickStartSection}>
      <div className={styles.container}>
        <h2>🚀 Quick Start</h2>
        <div className={styles.quickStartContent}>
          <div className={styles.quickStartStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Prerequisites</h3>
            <p>Review Chapter 0 for math notation and assumed knowledge (linear algebra, Python basics).</p>
          </div>
          <div className={styles.quickStartStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Core Concepts</h3>
            <p>Chapters 1-3 cover kinematics, dynamics, and ROS 2. Run code examples as you read.</p>
          </div>
          <div className={styles.quickStartStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Simulation & Integration</h3>
            <p>Chapters 4-6 teach simulation and AI integration. Build projects, compete in the hackathon.</p>
          </div>
          <div className={styles.quickStartStep}>
            <div className={styles.stepNumber}>4</div>
            <h3>Deploy on Real Robots</h3>
            <p>Use sim-to-real strategies to deploy your trained policies to real humanoid platforms.</p>
          </div>
        </div>
        <div className={styles.quickStartCTA}>
          <Link className={styles.primaryButton} to="/docs/chapters/ch0-preface">
            📖 Read Chapter 0: Prerequisites
          </Link>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className={styles.communitySection}>
      <div className={styles.container}>
        <h2>🌍 Join the Community</h2>
        <p className={styles.communityText}>
          This is an open-source project by the GIAIC Community. Contribute, ask questions, and build together.
        </p>
        <div className={styles.communityLinks}>
          <a href="https://github.com/JaveriaNigar" className={styles.communityLink}>
            👨‍💻 Author GitHub
          </a>
          <a href="https://www.linkedin.com/in/javeria-nigar-252b312b5/" className={styles.communityLink}>
            💼 Author LinkedIn
          </a>
          <a href="https://www.governorsindh.com" className={styles.communityLink}>
            🏫 GIAIC Official Site
          </a>
        </div>
      </div>
    </section>
  );
}

function CreditSection() {
  return (
    <section className={styles.creditSection}>
      <div className={styles.container}>
        <h3>👨‍💻 Creator & Contribution</h3>
        <p>
          <strong>Created By Javeria Nigar</strong> for the GIAIC Community
        </p>
        <p className={styles.creditText}>
          This textbook was designed as a free educational resource for the GIAIC Hackathon and broader robotics community.
          It combines cutting-edge research in humanoid robotics with practical, hands-on code examples.
        </p>
        <p className={styles.creditText}>
          <strong>License:</strong> MIT License - Free to use, modify, and distribute.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Free, open-source textbook for Physical AI & Humanoid Robotics">
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <ChaptersPreview />
        <QuickStartSection />
        <CommunitySection />
        <CreditSection />
      </main>
    </Layout>
  );
}
