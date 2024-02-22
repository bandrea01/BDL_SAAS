import {
  javascript,
  html,
  css,
  reactjs,
  tailwind,
  arangoDB,
  threejs,
  git,
  docker,
  python,
  fiware,
} from "../assets";

const navLinks = [
  {
    id: "about",
    title: "navbar.about",
  },
  {
    id: "technologies",
    title: "navbar.technologies",
  },
  {
    id: "viewer",
    title: "navbar.viewer",
  },
  {
    id: "management",
    title: "navbar.management"
  },
  {
    id: "documentation",
    title: "navbar.documentation",
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
    name: "ArangoDB",
    icon: arangoDB,
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
    name: "Fiware",
    icon: fiware,
  },
];

export { navLinks, technologies };
