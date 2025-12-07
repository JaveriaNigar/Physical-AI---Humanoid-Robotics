/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a set of docs in the sidebar
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Front Matter',
      items: [
        'chapters/ch0-preface',
        'chapters/ch0-prerequisites',
        'chapters/ch1-intro',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System (ROS 2)',
      items: [
        'modules/m1-ros2/m1-overview',
        'modules/m1-ros2/m1-nodes-topics-services',
        'modules/m1-ros2/m1-python-agents',
        'modules/m1-ros2/m1-urdf-humanoids',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Gazebo & Unity)',
      items: [
        'modules/m2-digital-twin/m2-overview',
        'modules/m2-digital-twin/m2-gazebo-physics',
        'modules/m2-digital-twin/m2-unity-rendering',
        'modules/m2-digital-twin/m2-sensor-simulation',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac)',
      items: [
        'modules/m3-isaac/m3-overview',
        'modules/m3-isaac/m3-isaac-sim',
        'modules/m3-isaac/m3-isaac-ros',
        'modules/m3-isaac/m3-nav2-planning',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        'modules/m4-vla/m4-overview',
        'modules/m4-vla/m4-voice-to-action',
        'modules/m4-vla/m4-cognitive-planning',
        'modules/m4-vla/m4-capstone-project',
      ],
    },
  ],
};

module.exports = sidebars;
