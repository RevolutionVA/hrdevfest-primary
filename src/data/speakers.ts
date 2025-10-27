export interface Speaker {
  name: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export const speakers: Speaker[] = [
  {
    name: "Lionel Sapp",
    bio: "Lionel Sapp is a Hampton Roads–based software engineer, community builder, and founder of The Digital Builders, a studio and mentorship network empowering others to turn their ideas into real-world products. A self-taught developer, Lionel has worked for two Techstars-backed startups, serving as CTO for one. Through Digital Builders, he leads mentorship programs and community events that teach aspiring creators how to build, launch, and grow their own tech ventures—right here in the 757.",
    image: "lionel-sapp.jpeg",
    linkedin: "https://www.linkedin.com/in/lionelthebldr/",
  },
];
