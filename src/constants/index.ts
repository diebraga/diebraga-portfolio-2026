export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
];

export const services = [
  { title: "Web Developer", icon: "/tech/reactjs.png" },
  { title: "React Native Developer", icon: "/tech/rn.png" },
  { title: "Backend Developer", icon: "/tech/nodejs.png", icon2: "/tech/python.png" },
  { title: "Web 3 Developer", icon: "/tech/ethh.png" },
];

export const technologies = [
  { name: "HTML 5", icon: "/tech/html.png" },
  { name: "CSS 3", icon: "/tech/css.png" },
  { name: "JavaScript", icon: "/tech/javascript.png" },
  { name: "TypeScript", icon: "/tech/typescript.png" },
  { name: "React JS", icon: "/tech/reactjs.png" },
  { name: "React Native", icon: "/tech/rn.png" },
  { name: "NextJs", icon: "/tech/next.png" },
  { name: "Tailwind CSS", icon: "/tech/tailwind.png" },
  { name: "Chakra ui", icon: "/tech/chackra.jpeg" },
  { name: "Graphql", icon: "/tech/graph.png" },
  { name: "Apollo", icon: "/tech/apollo.png" },
  { name: "React Query", icon: "/tech/query.png" },
  { name: "Three JS", icon: "/tech/threejs.svg" },
  { name: "Babylon", icon: "/tech/babylon.png" },
  { name: "nodejs", icon: "/tech/nodejs.png" },
  { name: "express", icon: "/tech/express.jpeg" },
  { name: "socket", icon: "/tech/socket.png" },
  { name: "grpc", icon: "/tech/grpc.png" },
  { name: "prisma", icon: "/tech/prisma.png" },
  { name: "python", icon: "/tech/python.png" },
  { name: "django", icon: "/tech/django.png" },
  { name: "git", icon: "/tech/git.png" },
];

export const experiences = [
  {
    title: "Full Stack Web Developer",
    company_name: "Kosmos",
    icon: "/kos.webp",
    iconBg: "#000",
    date: "Oct 2019 - Mar 2021",
    points: [
      "Developing frontend applications using Next.js and Chakra UI.",
      "Manipulating 3D scenes using Babylon.js or Three.js to provide users with an immersive gaming experience.",
      "Implementing responsive design and ensuring a seamless gaming experience across desktop and mobile devices.",
      "Developing and maintaining various Node.js microservices that communicate via REST, WebSockets and gRPC protocols.",
    ],
  },
  {
    title: "React Developer",
    company_name: "Templ8",
    icon: "/tech/8.png",
    iconBg: "#000",
    date: "Apr 2021 - Dec 2022",
    points: [
      "Developing and maintaining web applications using Next.js, Chakra UI and other related technologies.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "React and React Native Developer",
    company_name: "Hertz",
    icon: "/company/hertz.png",
    iconBg: "#fff",
    date: "Jan 2022 - Present",
    points: [
      "Developing and maintaining React.js microfrontends between different Hertz brands.",
      "Developing and maintaining React Native apps between different Hertz brands.",
      "Collaborating with cross-functional teams designers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Create unit tests using Jest and React Testing Library and E2E cypress.",
    ],
  },
];

export const testimonials = [
  {
    testimonial:
      "Diego played a key role in developing the virtual event platforms that have become central to our business.",
    name: "Humberto Yoshimoto",
    designation: "CEO",
    company: "Kosmos",
    image: "/humb.jpeg",
  },
  {
    testimonial:
      "Diego is one of the most talented and dedicated developers I had the pleasure of working with.",
    name: "Hudson Teixeira",
    designation: "Software Developer and Data Scientist",
    company: "",
    image: "/hud.jpeg",
  },
  {
    testimonial:
      "Diego's contributions to the microfrontend team have been vital to our business, significantly enhancing both our web and mobile deliveries.",
    name: "Sebastian Karolkiewicz",
    designation: "Senior Director Software Development at Hertz",
    company: "Hertz",
    image: "/seb.jpeg",
  },
];

export const projects = [
  {
    description: "A Minecraft clone with react, react-three-fiber and threejs.",
    title: "Minecraft Clone",
    header: "https://user-images.githubusercontent.com/52054459/225892189-affbd469-5e98-4d18-be76-c9d2a7803ca4.png",
    source_code_link: "https://github.com/diebraga/mine-craft-react",
    tags: ["React", "ThreeJs", "Zustand"],
    live: "https://mine-craft-react.vercel.app/",
  },
  {
    description: "FastAi app predicts the probability of image to be a Dog or a Cat.",
    title: "Image Classification",
    header: "https://user-images.githubusercontent.com/52054459/224771687-2ed97135-8669-4775-a81b-e1097fd26500.gif",
    source_code_link: "https://github.com/diebraga/image_classification_machine_learning",
    tags: ["FastAi", "Python", "FastApi"],
  },
  {
    description: "NextJs app simulates Google Street View functionalities with R3F.",
    title: "Tour View",
    header: "https://user-images.githubusercontent.com/52054459/224830831-78c14202-3f59-4d2e-bd11-b0a0abab0d05.gif",
    source_code_link: "https://github.com/diebraga/tour_view",
    tags: ["NextJS", "ThreeJs"],
    live: "https://tour-view.vercel.app/property",
  },
  {
    description: "NextJS Web 3 app where you store your ideas in the blockchain.",
    title: "My Ideas",
    header: "https://github.com/diebraga/my-ideas/assets/52054459/8f0f81ee-a84d-4e36-9b86-2ab6431b0ea9",
    source_code_link: "https://github.com/diebraga/my-ideas",
    tags: ["NextJS", "Solidity", "Hardhat"],
    live: "https://my-ideas-9vtbacpzr-diebraga.vercel.app/",
  },
  {
    description: "NextJS App renders a scene and 3th person camera using BabylonJs.",
    title: "BabylonJS Starter",
    header: "https://user-images.githubusercontent.com/52054459/224835610-f1f17da5-bb4d-494e-8d91-fa898e615fc0.gif",
    source_code_link: "https://github.com/diebraga/next_js_babylonjs_demo",
    tags: ["NextJS", "BabylonJS"],
    live: "https://full-stack-nextjs-auth.vercel.app/",
  },
  {
    description: "Simple realtime chat room with NextJs Nodejs Express and socketIo.",
    title: "Realtime Chatroom",
    header: "https://user-images.githubusercontent.com/52054459/224837848-912a5bd1-2fa0-47bd-8d59-78437d3eea98.gif",
    source_code_link: "https://github.com/diebraga/simple_chatroom_app",
    tags: ["NodeJS", "SocketIO", "React"],
  },
  {
    description: "Geography game guess countries or flags using Nextjs and ChakraUI.",
    title: "GeoGuessWorld",
    header: "https://user-images.githubusercontent.com/52054459/224839866-2b382fd5-fe92-4c30-a8d0-f656de87e3ba.gif",
    source_code_link: "https://github.com/diebraga/GuessGeoWorld",
    tags: ["NextJS", "ChakraUI"],
    live: "https://guess-geo-world.vercel.app/",
  },
  {
    description: "Web 3 app that sends ETH txs to addresses and stores in the blockchain",
    title: "Web3 Transactions",
    header: "https://github.com/diebraga/web-3-transactions/assets/52054459/012e6140-04f8-4202-b902-0a9ebdcbfda0",
    source_code_link: "https://github.com/diebraga/web-3-transactions",
    tags: ["Vite", "Solidity", "Tailwind"],
    live: "https://web-3-transactions.vercel.app/",
  },
  {
    description: "Shopping cart in with Nextjs, using api routes and stripe checkout.",
    title: "Stripe Shop",
    header: "https://user-images.githubusercontent.com/52054459/200176756-f34c8511-841b-42aa-b1b7-0d2829a9bdd5.png",
    source_code_link: "https://github.com/diebraga/ignite_shop_2022",
    tags: ["NextJS", "Stitches", "Stripe"],
    live: "https://ignite-shop-2022.vercel.app/",
  },
  {
    description: "A Facial recognition app with python, openCv, fastApi and React.",
    title: "Facial Recognition",
    header: "https://user-images.githubusercontent.com/52054459/225896553-f9cef9b9-26ff-43d6-affc-8448e812eac1.png",
    source_code_link: "https://github.com/diebraga/facial_recognition",
    tags: ["OpenCv", "Python", "FastApi"],
  },
];
