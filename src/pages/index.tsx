import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/about/overview">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`欢迎访问 ${siteConfig.title}`}
      description="">
      <BrowserOnly>
        {() => window.location.href = '/docs/about/overview'}
      </BrowserOnly>
      {/* <HomepageHeader /> */}
      <main>
        {/* <HomepageFeatures /> */}
        If you are not redirected automatically, follow this
        <a href="/docs/about/overview">link</a>.
      </main>
    </Layout>
  );
}
