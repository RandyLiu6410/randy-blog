import React from 'react';
import { useDoc } from "@docusaurus/theme-common/internal";
import Footer from '@theme-original/DocItem/Footer';
import GiscusComponent from '@site/src/components/GiscusComponent';
import useIsBrowser from '@docusaurus/useIsBrowser';

import styles from './footer.module.css'

export default function FooterWrapper(props) {
  const isBrowser = useIsBrowser();

  const { metadata } = useDoc();
  const { frontMatter } = metadata
  const { enableComments } = frontMatter

  return (
    <>
      <Footer {...props} />
      {(enableComments && isBrowser) && (
        <div className={styles.giscus}>
          <GiscusComponent />
        </div>
      )}
    </>
  );
}
