import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import TypingTypography, { TypingTypographyItem } from '../components/typing-typography';

function HomepageHeader() {
  const typingItems: Array<TypingTypographyItem> = [
    {
      value: 'Learn it.',
      duration: 2000
    },
    {
      value: 'Note it.',
      duration: 2000
    },
    {
      value: 'And share it.',
      duration: 2000
    }
  ]

  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <TypingTypography items={typingItems} />
        </Heading>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}>
      <HomepageHeader />
    </Layout>
  );
}
