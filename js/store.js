/* ============================================================
   PORTFOLIO CONTENT STORE
   All editable content lives here. Admin dashboard reads/writes
   to localStorage under KEY. index.html reads via window.PS.get()
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'iej_portfolio_v1';

  var DEFAULTS = {
    status: { available: true, text: 'Available for new opportunities' },

    hero: {
      tagline: 'Building scalable, user-centered web applications and AI-powered products. Currently shipping <strong>CreatorHQ</strong> at HAUZ — London, UK.',
      roles: ['Full-Stack Developer', 'Frontend Developer', 'Software Engineer', 'Backend Developer']
    },

    about: {
      p1: "I'm a <strong>full-stack developer</strong> with a B.Eng. in Computer Science and Communication Engineering from Lebanese International University. I'm passionate about building products that are technically solid and genuinely useful.",
      p2: "Currently at <strong>HAUZ</strong> (London), I'm developing <strong>CreatorHQ</strong> — an AI-powered platform for creator business management including brand deal tracking, contracts, and revenue monitoring. I specialize in the <strong>MERN stack</strong>, Next.js, and Laravel.",
      p3: "I thrive at the intersection of clean architecture, thoughtful design, and scalable systems. Beyond code, I've mentored students, volunteered in humanitarian initiatives, and worked across fast-paced startup environments.",
      location: 'Lebanon · Open to All Opportunities',
      education: 'B.Eng. Computer Science & Comm. Engineering',
      languages: 'Arabic · English · French'
    },

    stats: {
      years: 2, yearsLabel: 'Yrs Experience',
      projects: 10,
      stacks: 8,
      languages: 3
    },

    location: 'Lebanon · Open to All Opportunities',
    github: 'https://github.com/ibraheem-Jechi',
    linkedin: 'https://linkedin.com/in/ibrahim-el-jichi',
    email: 'Ibrahimj02@outlook.com',
    phone: '+961 78 860 266',

    experience: [
      {
        id: 'hauz',
        role: 'Software Engineer',
        company: 'HAUZ — CreatorHQ',
        location: 'London, UK (Remote)',
        date: 'Apr 2026 – Present',
        current: true,
        bullets: [
          'Developing an AI-powered platform for creator business management — brand deal tracking, contract handling, and revenue monitoring',
          'Building and maintaining core backend systems including data models, APIs, and business logic for scalable product functionality',
          'Integrating third-party services including Gmail/inbox systems to streamline communication and automation',
          'Contributing to AI-powered intelligent workflows and automation tools in an agile startup environment'
        ],
        tags: ['AI / ML', 'Node.js', 'MongoDB', 'REST APIs', 'GitHub', 'Agile']
      },
      {
        id: 'unrwa',
        role: 'Full-Stack Web Development Intern',
        company: 'UNRWA & Digital Hub',
        location: 'On-site',
        date: 'Jul – Dec 2025',
        current: false,
        bullets: [
          'Built full-stack projects using MERN stack, Laravel, PHP, and MySQL',
          'Developed RESTful APIs via Express.js, Next.js, and Laravel to streamline backend operations',
          'Produced feature-rich dashboards and informative portals for fintech and role-based systems',
          'Operated within Agile SDLC using Jira, sprint reviews, and daily standups'
        ],
        tags: ['MERN', 'Laravel', 'MySQL', 'Next.js', 'Jira']
      },
      {
        id: 'startup',
        role: 'Junior Software Engineer',
        company: 'Early-Stage Startup (Stealth Mode)',
        location: 'Remote',
        date: 'Aug – Dec 2025',
        current: false,
        bullets: [
          'Developed a cross-platform mobile application using Flutter (Dart)',
          'Implemented UI components and application logic in a fast-paced agile environment'
        ],
        tags: ['Flutter', 'Dart', 'Mobile', 'Agile']
      },
      {
        id: 'freelance',
        role: 'Freelance Web Developer',
        company: 'Self-Employed',
        location: 'Remote',
        date: 'Jun 2023 – Present',
        current: false,
        bullets: [
          'Delivered responsive, user-focused websites and scalable web applications for multiple clients',
          'Collaborated with clients to build tailored solutions using modern technologies'
        ],
        tags: ['React', 'Next.js', 'Node.js', 'Laravel']
      }
    ],

    projects: [
      {
        id: 'creatorhq', featured: true,
        name: 'CreatorHQ',
        badge: 'In Progress', badgeType: 'progress',
        lock: true, github: null, demo: null,
        desc: 'AI-powered platform for creator business management at HAUZ. Supports brand deal tracking, contract handling, revenue monitoring, and Gmail integration with intelligent automation workflows.',
        stack: ['AI/ML', 'Node.js', 'MongoDB', 'REST APIs', 'Gmail API'],
        visual: 'vis-ai', icon: 'fa-robot'
      },
      {
        id: 'pos', featured: false,
        name: 'Supermarket POS System',
        badge: null, lock: false,
        github: 'https://github.com/ibraheem-Jechi', demo: null,
        desc: 'Full POS application with barcode scanning, automated billing, multi-role access (Admin, Clerk, Accountant), sales analytics, and real-time inventory management.',
        stack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
        visual: 'vis-teal', icon: 'fa-cash-register'
      },
      {
        id: 'renthub', featured: false,
        name: 'RentHub',
        badge: null, lock: false,
        github: 'https://github.com/ibraheem-Jechi', demo: null,
        desc: 'Student dormitory & housing platform for browsing and renting rooms near universities. Features property listings, search & filtering, and user authentication.',
        stack: ['Next.js', 'React', 'MongoDB'],
        visual: 'vis-blue', icon: 'fa-house'
      },
      {
        id: 'blood-bank', featured: false,
        name: 'Blood Bank Donation System',
        badge: null, lock: false,
        github: 'https://github.com/ibraheem-Jechi/Blood-Bank', demo: null,
        desc: 'Web platform where donors register, check eligibility, and book donation appointments. Sends automated email reminders before appointments and includes QR code scanning for donor check-in.',
        stack: ['HTML5', 'JavaScript', 'CSS3', 'Email Automation'],
        visual: 'vis-red', icon: 'fa-heart-pulse'
      },
      {
        id: 'digital-hub', featured: false,
        name: 'Digital Hub Website',
        badge: null, lock: false,
        github: 'https://github.com/ibraheem-Jechi', demo: null,
        desc: 'Fully responsive informative website with an admin dashboard featuring role-based access control for seamless content management.',
        stack: ['Laravel', 'PHP', 'MySQL'],
        visual: 'vis-purple', icon: 'fa-globe'
      }
    ],

    certificates: [
      {
        id: 'sfactory',
        icon: 'fa-laptop-code',
        name: 'Full-Stack Development Bootcamp',
        issuer: 'SeFactory (FCS)',
        year: '2025'
      },
      {
        id: 'digital-hub-cert',
        icon: 'fa-code',
        name: 'Full-Stack Web Development',
        issuer: 'Digital Hub — UNRWA',
        year: '2025'
      },
      {
        id: 'ccna',
        icon: 'fa-network-wired',
        name: 'Network & Telecommunications / CCNA Fundamentals',
        issuer: 'Cisco / LIU',
        year: '2023'
      },
      {
        id: 'flutter',
        icon: 'fa-mobile-alt',
        name: 'Flutter & Dart — Mobile Development',
        issuer: 'Udemy',
        year: '2024'
      }
    ]
  };

  window.PS = {
    get: function () {
      try {
        var stored = localStorage.getItem(KEY);
        if (!stored) return JSON.parse(JSON.stringify(DEFAULTS));
        var p = JSON.parse(stored);
        var d = DEFAULTS;
        return {
          status:   Object.assign({}, d.status,  p.status  || {}),
          hero: {
            tagline: (p.hero && p.hero.tagline != null) ? p.hero.tagline : d.hero.tagline,
            roles:   (p.hero && Array.isArray(p.hero.roles)) ? p.hero.roles : d.hero.roles.slice()
          },
          about: {
            p1:        (p.about && p.about.p1        != null) ? p.about.p1        : d.about.p1,
            p2:        (p.about && p.about.p2        != null) ? p.about.p2        : d.about.p2,
            p3:        (p.about && p.about.p3        != null) ? p.about.p3        : d.about.p3,
            location:  (p.about && p.about.location  != null) ? p.about.location  : d.about.location,
            education: (p.about && p.about.education != null) ? p.about.education : d.about.education,
            languages: (p.about && p.about.languages != null) ? p.about.languages : d.about.languages
          },
          stats:        Object.assign({}, d.stats,   p.stats   || {}),
          location:     p.location     != null ? p.location     : d.location,
          github:       p.github       != null ? p.github       : d.github,
          linkedin:     p.linkedin     != null ? p.linkedin     : d.linkedin,
          email:        p.email        != null ? p.email        : d.email,
          phone:        p.phone        != null ? p.phone        : d.phone,
          experience:   p.experience   || d.experience,
          projects:     p.projects     || d.projects,
          certificates: p.certificates || d.certificates
        };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULTS));
      }
    },

    save: function (data) {
      localStorage.setItem(KEY, JSON.stringify(data));
    },

    reset: function () {
      localStorage.removeItem(KEY);
    },

    defaults: function () {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  };
})();
