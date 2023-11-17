import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { EnumChangefreq } from 'sitemap';
import 'dotenv/config';

const config: Config = {
  title: 'Randy\'s blog',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://blog.randy-liu.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Randy Liu', // Usually your GitHub org/user name.
  projectName: 'randy-blog', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://www.blog.randy-liu.com',
      },
    }
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: EnumChangefreq.DAILY,
          priority: 0.8,
          ignorePatterns: ['/**/tags/**', ],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'Randy\'s blog',
      logo: {
        alt: 'Randy\'s blog Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'techNotesSidebar',
          position: 'left',
          label: 'Tech Notes',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://randy-liu.com',
          label: 'Official Website',
          position: 'right',
        },
        {
          href: 'http://github.com/RandyLiu6410',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Randy's blog, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      // Algolia 提供的应用 ID
      appId: process.env.ALGOLIA_APP_ID,

      //  公开 API 密钥：提交它没有危险
      apiKey: process.env.ALGOLIA_APP_KEY,

      indexName: 'wwwrandy-liu',

      // 可选: 搜索页面的路径，默认启用(可用`false`禁用)
      searchPagePath: 'search',

      contextualSearch: false
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
