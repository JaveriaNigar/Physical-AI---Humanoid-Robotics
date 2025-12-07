import axios from 'axios';

/**
 * Personalization Service
 * Handles content recommendations based on user background
 */

class PersonalizationService {
  /**
   * Get recommended content based on user background
   * @param {Object} userProfile - User's profile with background info
   * @returns {Object} Recommended content structure
   */
  static getRecommendedContent(userProfile) {
    if (!userProfile) return null;

    const { softwareBackground, hardwareBackground, interests, experience } = userProfile;

    return {
      difficulty: this.calculateDifficulty(softwareBackground, hardwareBackground),
      focusAreas: this.getFocusAreas(softwareBackground, hardwareBackground, interests),
      recommendedModules: this.getRecommendedModules(softwareBackground, hardwareBackground, interests),
      resources: this.getRecommendedResources(softwareBackground, hardwareBackground, experience),
      learningPath: this.generateLearningPath(softwareBackground, hardwareBackground),
    };
  }

  /**
   * Calculate overall content difficulty level
   */
  static calculateDifficulty(softwareBackground, hardwareBackground) {
    let softwareScore = 0;
    let hardwareScore = 0;

    // Score software background
    if (softwareBackground.includes('Beginner')) softwareScore = 1;
    else if (softwareBackground.includes('Intermediate')) softwareScore = 2;
    else if (softwareBackground.includes('Advanced')) softwareScore = 3;
    else if (softwareBackground.includes('Expert')) softwareScore = 4;

    // Score hardware background
    if (hardwareBackground.includes('Beginner')) hardwareScore = 1;
    else if (hardwareBackground.includes('Intermediate')) hardwareScore = 2;
    else if (hardwareBackground.includes('Advanced')) hardwareScore = 3;
    else if (hardwareBackground.includes('Expert')) hardwareScore = 4;

    const avgScore = (softwareScore + hardwareScore) / 2;

    if (avgScore <= 1.5) return 'beginner';
    if (avgScore <= 2.5) return 'intermediate';
    if (avgScore <= 3.5) return 'advanced';
    return 'expert';
  }

  /**
   * Determine focus areas based on background
   */
  static getFocusAreas(softwareBackground, hardwareBackground, interests) {
    const areas = [];

    // Software focus
    if (softwareBackground.includes('Beginner')) {
      areas.push('Python Fundamentals', 'ROS 2 Basics');
    } else if (softwareBackground.includes('Intermediate')) {
      areas.push('Python Advanced', 'ROS 2 Architecture');
    } else {
      areas.push('ML/AI Integration', 'Advanced ROS 2 Patterns');
    }

    // Hardware focus
    if (hardwareBackground.includes('Beginner')) {
      areas.push('Robotics Fundamentals', 'Kinematics Basics');
    } else if (hardwareBackground.includes('Intermediate')) {
      areas.push('Dynamics & Control', 'Simulation');
    } else {
      areas.push('Hardware Integration', 'Real-world Deployment');
    }

    // Add interest-based areas
    if (interests && interests.length > 0) {
      areas.push(...interests);
    }

    return [...new Set(areas)]; // Remove duplicates
  }

  /**
   * Get recommended modules based on background
   */
  static getRecommendedModules(softwareBackground, hardwareBackground, interests) {
    const modules = [];

    // Always recommend Module 1 (ROS2)
    modules.push({
      id: 'm1-ros2',
      title: 'Module 1: ROS 2 Fundamentals',
      priority: 'high',
      reason: 'Foundation for all robotics development',
    });

    // Module 2 recommendation based on hardware background
    if (!hardwareBackground.includes('Beginner')) {
      modules.push({
        id: 'm2-digital-twin',
        title: 'Module 2: Digital Twin & Simulation',
        priority: 'high',
        reason: 'Recommended for your hardware experience level',
      });
    } else {
      modules.push({
        id: 'm2-digital-twin',
        title: 'Module 2: Digital Twin & Simulation',
        priority: 'medium',
        reason: 'Learn simulation concepts',
      });
    }

    // Module 3 recommendation based on software/hardware background
    if (!softwareBackground.includes('Beginner') || !hardwareBackground.includes('Beginner')) {
      modules.push({
        id: 'm3-isaac',
        title: 'Module 3: NVIDIA Isaac Ecosystem',
        priority: 'high',
        reason: 'Advanced simulation and AI integration',
      });
    }

    // Module 4 recommendation based on interests
    if (interests && interests.includes('Machine Learning')) {
      modules.push({
        id: 'm4-vla',
        title: 'Module 4: Vision-Language Models',
        priority: 'high',
        reason: 'Matches your ML interest',
      });
    } else {
      modules.push({
        id: 'm4-vla',
        title: 'Module 4: Vision-Language Models',
        priority: 'medium',
        reason: 'Advanced AI for robotics',
      });
    }

    return modules;
  }

  /**
   * Get recommended resources
   */
  static getRecommendedResources(softwareBackground, hardwareBackground, experience) {
    const resources = [];

    if (softwareBackground.includes('Beginner') || softwareBackground.includes('Intermediate')) {
      resources.push({
        type: 'Tutorial',
        title: 'Python Programming for Robotics',
        difficulty: 'Beginner',
      });
    }

    if (!hardwareBackground.includes('Beginner')) {
      resources.push({
        type: 'Guide',
        title: 'ROS 2 Hardware Integration Guide',
        difficulty: 'Advanced',
      });
    }

    if (experience === 'Student') {
      resources.push({
        type: 'Project',
        title: 'Beginner Humanoid Project',
        difficulty: 'Beginner',
      });
    } else if (experience === 'Professional' || experience === 'Researcher') {
      resources.push({
        type: 'Research Paper',
        title: 'Latest Humanoid Robotics Research',
        difficulty: 'Advanced',
      });
    }

    return resources;
  }

  /**
   * Generate a personalized learning path
   */
  static generateLearningPath(softwareBackground, hardwareBackground) {
    const path = [];

    // Phase 1: Fundamentals
    path.push({
      phase: 1,
      title: 'Fundamentals',
      topics: ['Robot Anatomy', 'Kinematics Basics', 'ROS 2 Introduction'],
      estimatedTime: '2-3 weeks',
    });

    // Phase 2: Core Concepts
    if (softwareBackground.includes('Beginner')) {
      path.push({
        phase: 2,
        title: 'Software Foundations',
        topics: ['Python for Robotics', 'ROS 2 Architecture', 'Node & Topic Basics'],
        estimatedTime: '3-4 weeks',
      });
    } else {
      path.push({
        phase: 2,
        title: 'Advanced Software',
        topics: ['ROS 2 Services & Actions', 'Advanced Python Patterns', 'Custom Middleware'],
        estimatedTime: '2-3 weeks',
      });
    }

    // Phase 3: Practical Implementation
    path.push({
      phase: 3,
      title: 'Simulation & Control',
      topics: ['Gazebo Simulation', 'Motion Planning', 'Control Systems'],
      estimatedTime: '4-5 weeks',
    });

    // Phase 4: Advanced Topics
    path.push({
      phase: 4,
      title: 'AI & Deployment',
      topics: ['Vision-Language Models', 'Real-world Deployment', 'Capstone Project'],
      estimatedTime: '5-6 weeks',
    });

    return path;
  }

  /**
   * Get content adaptation guidelines
   * Returns specific guidance on how to adapt content for the user
   */
  static getContentAdaptationGuidelines(userProfile) {
    const guidelines = {
      codeExampleStyle: 'beginner-friendly-with-comments',
      explanationLevel: 'detailed',
      visualizationPreference: 'diagrams-and-animations',
      pacingRecommendation: 'moderate',
    };

    if (userProfile.softwareBackground.includes('Expert')) {
      guidelines.codeExampleStyle = 'production-ready';
      guidelines.explanationLevel = 'concise';
      guidelines.visualizationPreference = 'interactive-tools';
      guidelines.pacingRecommendation = 'fast';
    } else if (userProfile.softwareBackground.includes('Advanced')) {
      guidelines.codeExampleStyle = 'professional';
      guidelines.explanationLevel = 'standard';
      guidelines.visualizationPreference = 'diagrams';
      guidelines.pacingRecommendation = 'moderate-fast';
    }

    return guidelines;
  }
}

export default PersonalizationService;
