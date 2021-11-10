module.exports = {
  title: `broccolism`,
  description: `자기 계발 일지`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://broccolism.github.io/`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `broccolism/broccolism-gatsby-blog`,
    },
  },
  ga: '0', // Google Analytics Tracking ID
  author: {
    name: `손영인`,
    bio: {
      role: `개발자`,
      description: ['사람에 가치를 두는', '능동적으로 일하는', '이로운 것을 만드는'],
      thumbnail: 'sample.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/broccolism`,
      linkedIn: ``,
      email: `mile3880@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2021.11 ~',
        activity: 'blog start!',
        links: {
          // post: '/gatsby-starter-zoomkoding-introduction',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        title: 'tmp',
        description: '(tmp)',
        techStack: ['gatsby', 'react'],
        thumbnailUrl: 'blog.png',
        links: {
          //
          // post: '/gatsby-starter-zoomkoding-introduction',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
    ],
  },
};
