import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '95e'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '22d'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '8af'),
            routes: [
              {
                path: '/docs/AUTHENTICATION_GUIDE',
                component: ComponentCreator('/docs/AUTHENTICATION_GUIDE', '19f'),
                exact: true
              },
              {
                path: '/docs/chapters/ch0-preface',
                component: ComponentCreator('/docs/chapters/ch0-preface', '4e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/ch0-prerequisites',
                component: ComponentCreator('/docs/chapters/ch0-prerequisites', 'f70'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/ch1-intro',
                component: ComponentCreator('/docs/chapters/ch1-intro', 'cb6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/ch2-humanoid',
                component: ComponentCreator('/docs/chapters/ch2-humanoid', '80b'),
                exact: true
              },
              {
                path: '/docs/chapters/ch3-ros2',
                component: ComponentCreator('/docs/chapters/ch3-ros2', '725'),
                exact: true
              },
              {
                path: '/docs/chapters/ch4-sim',
                component: ComponentCreator('/docs/chapters/ch4-sim', 'a10'),
                exact: true
              },
              {
                path: '/docs/chapters/ch5-vla',
                component: ComponentCreator('/docs/chapters/ch5-vla', '342'),
                exact: true
              },
              {
                path: '/docs/chapters/ch6-capstone',
                component: ComponentCreator('/docs/chapters/ch6-capstone', '1f9'),
                exact: true
              },
              {
                path: '/docs/modules/m1-ros2/m1-nodes-topics-services',
                component: ComponentCreator('/docs/modules/m1-ros2/m1-nodes-topics-services', 'a08'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m1-ros2/m1-overview',
                component: ComponentCreator('/docs/modules/m1-ros2/m1-overview', 'a25'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m1-ros2/m1-python-agents',
                component: ComponentCreator('/docs/modules/m1-ros2/m1-python-agents', '638'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m1-ros2/m1-urdf-humanoids',
                component: ComponentCreator('/docs/modules/m1-ros2/m1-urdf-humanoids', '95f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m2-digital-twin/m2-gazebo-physics',
                component: ComponentCreator('/docs/modules/m2-digital-twin/m2-gazebo-physics', '5f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m2-digital-twin/m2-overview',
                component: ComponentCreator('/docs/modules/m2-digital-twin/m2-overview', '6d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m2-digital-twin/m2-sensor-simulation',
                component: ComponentCreator('/docs/modules/m2-digital-twin/m2-sensor-simulation', '7be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m2-digital-twin/m2-unity-rendering',
                component: ComponentCreator('/docs/modules/m2-digital-twin/m2-unity-rendering', '00c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m3-isaac/m3-isaac-ros',
                component: ComponentCreator('/docs/modules/m3-isaac/m3-isaac-ros', '3c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m3-isaac/m3-isaac-sim',
                component: ComponentCreator('/docs/modules/m3-isaac/m3-isaac-sim', '591'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m3-isaac/m3-nav2-planning',
                component: ComponentCreator('/docs/modules/m3-isaac/m3-nav2-planning', '4b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m3-isaac/m3-overview',
                component: ComponentCreator('/docs/modules/m3-isaac/m3-overview', '567'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m4-vla/m4-capstone-project',
                component: ComponentCreator('/docs/modules/m4-vla/m4-capstone-project', '423'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m4-vla/m4-cognitive-planning',
                component: ComponentCreator('/docs/modules/m4-vla/m4-cognitive-planning', 'ec4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m4-vla/m4-overview',
                component: ComponentCreator('/docs/modules/m4-vla/m4-overview', '72c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/m4-vla/m4-voice-to-action',
                component: ComponentCreator('/docs/modules/m4-vla/m4-voice-to-action', 'f22'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
