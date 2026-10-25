// Site-wide facts. Edit here, not in components.

export interface NavItem {
  href: string;
  label: string;
}

export const site = {
  name: 'Michael VanDyke',
  brand: 'MVD',
  title: 'MVD Makes Things',
  url: 'https://mvdmakesthings.com',
  description:
    'Michael VanDyke (MVD) is a software engineering leader, visual artist, and lifelong maker in Louisville, Kentucky. Projects, writing, art, and resume.',
  location: 'Louisville, Kentucky',
  email: 'me@mjvandyke.com',
  source: 'https://github.com/mvdmakesthings/mvdmakesthings.com',
  links: {
    github: 'https://github.com/mvdmakesthings',
    instagram: 'https://www.instagram.com/mvdmakesthings/',
    linkedin: 'https://www.linkedin.com/in/mjvandyke/',
    itch: 'https://mvdmakesthings.itch.io/',
  },
  nav: [
    { href: '/projects/', label: 'Projects' },
    { href: '/writing/', label: 'Writing' },
    { href: '/art/', label: 'Art' },
    { href: '/resume/', label: 'Resume' },
  ] satisfies NavItem[],
} as const;

export const socialLinks = [
  { href: site.links.github, label: 'GitHub' },
  { href: site.links.instagram, label: 'Instagram' },
  { href: site.links.linkedin, label: 'LinkedIn' },
  { href: site.links.itch, label: 'itch.io' },
];
