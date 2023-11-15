import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import { TypeAnimation } from "react-type-animation";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Learn it.",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              "Note it.",
              1000,
              "And share it.",
              1000
            ]}
            wrapper="span"
            speed={5}
            deletionSpeed={15}
            style={{ fontSize: "1em", display: "inline-block" }}
            repeat={Infinity}
          />
        </Heading>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={`Hello from ${siteConfig.title}`}>
      <HomepageHeader />
    </Layout>
  );
}
