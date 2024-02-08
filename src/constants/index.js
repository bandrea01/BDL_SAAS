import {
  information,
  creative,
  innovation,
  vscode,

  javascript,
  html,
  css,
  reactjs,
  tailwind,
  mongodb,
  threejs,
  git,
  docker,
  python,
  redis,
  java,
  mysql,
  blender,

  vidyasoft,
  adeept,
  laterradelleapi,

  github,
  instagram,
  linkedin,
  whatsapp,

  mousecam,
  arnie,
  arduino,
  cv_arm,
} from "../assets";


const navLinks = [
  {
    id: 'about',
    title: 'navbar.about',
  },
  {
    id: 'work',
    title: 'navbar.work',
  },
  {
    id: 'contact',
    title: 'navbar.contact',
  },
];


const services = [
  {
    title: "about.card1",
    icon: information,
  },
  {
    title: "about.card2",
    icon: creative,
  },
  {
    title: "about.card3",
    icon: innovation,
  },
  {
    title: "about.card4",
    icon: vscode,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind",
    icon: tailwind,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "Git",
    icon: git,
  },
  {
    name: "Docker",
    icon: docker,
  },
  {
    name: "Python",
    icon: python,
  },
  {
    name: "Java",
    icon: java,
  },
  {
    name: "MySql",
    icon: mysql,
  },
  {
    name: "Redis",
    icon: redis,
  },
  {
    name: "Blender",
    icon: blender,
  },
  {
    name: "Arduino",
    icon: arduino,
  }
];

const experiences = [ 
  { 
    title:"vidyasoft.role",
    company_name: "vidyasoft.company",
    icon: vidyasoft,
    iconBg: "#383E56",
    date: "vidyasoft.period",
    points: [
      "vidyasoft.dot1",
      "vidyasoft.dot2",
      "vidyasoft.dot3"
    ],
  },
  {
    title: "adeept.role",
    company_name: "adeept.company",
    icon: adeept,
    iconBg: "#E6DEDD",
    date: "adeept.period",
    points: [
      "adeept.dot1",
      "adeept.dot2",
      "adeept.dot3"
    ],
  }, 
];


const testimonials = [
  {
    testimonial: "testimonials.feedback1",
    name: "La Terra delle Api",
    designation: "Staff",
    company: "La Terra delle api",
    image: laterradelleapi,
  },
  {
    testimonial: "testimonials.feedback2",
    name: "Adeept technical team",
    designation: "Staff",
    company: "Adeept",
    image: adeept,
  },
  {
    testimonial: "testimonials.feedbackDefault",
    name: "Coming Soon",
    designation: "Staff",
    company: "...",
    image: "https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg",
  },
];

const projects = [
  {
    name: "projects.cv_arm.title",
    description:"projects.mousecam.bio",
    tags: [
      {
        name: "Python",
        color: "blue-text-gradient",
      },
      {
        name: "OpenCV",
        color: "green-text-gradient",
      },
      {
        name: "cvzone",
        color: "pink-text-gradient",
      },
      {
        name: "Arduino",
        color: "blue-text-gradient",
      },
    ],
    image: cv_arm,
    source_code_link: "https://github.com/andrea-andrenucci",
  },
  {
    name: "projects.mousecam.title",
    description:"projects.mousecam.bio",
    tags: [
      {
        name: "Python",
        color: "blue-text-gradient",
      },
      {
        name: "OpenCV",
        color: "green-text-gradient",
      },
      {
        name: "cvzone",
        color: "pink-text-gradient",
      },
    ],
    image: mousecam,
    source_code_link: "https://github.com/andrea-andrenucci/MouseCam",
  },
  {
    name: "projects.arnia.title",
    description:"projects.arnia.bio",
    tags: [
      {
        name: "blender",
        color: "orange-text-gradient",
      }
    ],
    image: arnie,
    source_code_link: "https://github.com/andrea-andrenucci",
  },
  {
    name: "projects.comingsoon.title",
    description:
      "projects.comingsoon.bio", 
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: "https://www.pcworld.com/wp-content/uploads/2023/05/2656148025.jpg?quality=50&strip=all",
    source_code_link: "https://github.com/andrea-andrenucci",
  },
];

const social = [
  {
    name:'github',
    icon:github,
    link:'https://github.com/andrea-andrenucci',
  },
  {
    name:'instagram',
    icon:instagram,
    link:'https://instagram.com/andrenucciandrea?igshid=ZGUzMzM3NWJiOQ==',
  },
  {
    name:'linkedin',
    icon:linkedin,
    link:'https://www.linkedin.com/in/andrea-andrenucci-6029b3187/',
  },
  {
    name:'whatsapp',
    icon:whatsapp,
    link:'https://wa.me/3336468174',
  }
]




export {navLinks, services, technologies, experiences, testimonials, projects, social};
