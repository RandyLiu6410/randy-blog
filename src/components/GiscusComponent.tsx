import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

  return (
    <Giscus    
      repo="RandyLiu6410/randy-blog"
      repoId="R_kgDOKt1Ufw"
      category="General"
      categoryId="DIC_kwDOKt1Uf84CbXSz"  // E.g. id of "General"
      mapping="url"                        // Important! To map comments to URL
      term="Welcome to Randy's Blog!"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={colorMode}
      lang="zh-TW"
      loading="lazy"
    />
  );
}