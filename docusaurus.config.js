// @ts-check
const remarkMath = require('remark-math').default;
const rehypeKatex = require('rehype-katex').default;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics Book',
  tagline: 'Free, open-source textbook created by Javeria Nigar for the GIAIC Community',
  favicon: 'img/favicon.ico',

  // Set the production URL of this site here
  url: 'https://physical-ai-humanoid-robotics-book-tan.vercel.app/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For Vercel deployment, use root path '/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'Danishhshahid',
  projectName: 'Physical-AI-Humanoid-Robotics-Book',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Danishhshahid/Physical-AI-Humanoid-Robotics-Book/tree/main/website',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Textbook',
          },
          {
            href: 'https://github.com/JaveriaNigar',
            label: 'Author (GitHub)',
            position: 'right',
          },
          {
            href: 'https://www.linkedin.com/in/javeria-nigar-252b312b5',
            label: 'LinkedIn',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Chapters',
            items: [
              {
                label: 'Chapter 1: Introduction',
                to: '/docs/ch1-intro',
              },
              {
                label: 'Chapter 2: Humanoid Basics',
                to: '/docs/ch2-humanoid',
              },
              {
                label: 'Chapter 3: ROS 2',
                to: '/docs/ch3-ros2',
              },
              {
                label: 'Chapter 4: Simulation',
                to: '/docs/ch4-sim',
              },
              {
                label: 'Chapter 5: VLA Systems',
                to: '/docs/ch5-vla',
              },
              {
                label: 'Chapter 6: Capstone',
                to: '/docs/ch6-capstone',
              },
            ],
          },
          {
            title: 'Community & Creator',
            items: [
              
              {
                label: 'Author GitHub',
                href: 'https://github.com/Danishhshahid',
              },
              {
                label: 'Author LinkedIn',
                href: 'https://www.linkedin.com/in/danish-shahid-abbasi-6952a42b5/',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'ROS 2 Docs',
                href: 'https://docs.ros.org/en/humble/',
              },
              {
                label: 'Gazebo',
                href: 'https://gazebosim.org/docs',
              },
              {
                label: 'Ollama',
                href: 'https://ollama.ai',
              },
            ],
          },
        ],
        copyright: `
          MIT License © 2025 Created by <strong>Danish Abbasi</strong> for <strong>GIAIC Community</strong><br/>
          <em>Physical AI & Humanoid Robotics Essentials</em><br/>
          Built with Docusaurus | Hosted on GitHub Pages<br/>
          <a href="https://github.com/GIAIC-Community/Physical-AI-Textbook/blob/master/LICENSE">License</a>
        `,
      },
      prism: {
        additionalLanguages: ['bash', 'python', 'yaml'],
      },
      announcementBar: {
        id: 'announcement',
        content:
          'Created by Danish Abbasi for GIAIC Community - Free Textbook for Humanoid Robotics & AI',
        isCloseable: true,
      },
    }),
};

module.exports = config;
