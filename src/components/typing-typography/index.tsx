import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";

export interface TypingTypographyItem {
  value: string;
  duration: number;
}

export interface TypingTypographyProps {
  className?: string;
  items: Array<TypingTypographyItem>;
}

const TypingTypography = React.memo<TypingTypographyProps>(
  function TypingTypography({ className, items }) {
    // 一個字的時間(ms)
    const increasingTick = 150;
    const decreasingTick = 100;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");

    const intervalIncreasing = useRef<NodeJS.Timeout>(null);
    const intervalDecreasing = useRef<NodeJS.Timeout>(null);
    const timer = useRef<NodeJS.Timeout>(null);

    const increasingTicking = () => {
      if (!items[currentIndex]) return;

      const { value } = items[currentIndex];
      let rest = value;

      // 開始append字體到currentText
      intervalIncreasing.current = setInterval(() => {
        setCurrentText((prev) => {
          const t = rest[0];
          rest = rest.substring(1);
          return prev + (t ?? "");
        });

        if (rest.length === 0) {
          clearInterval(intervalIncreasing.current);

          decreasingTicking();
        }
      }, increasingTick);
    };

    const decreasingTicking = () => {
      const { value, duration } = items[currentIndex];
      let rest = "";

      timer.current = setTimeout(() => {
        intervalDecreasing.current = setInterval(() => {
          setCurrentText((prev) => {
            rest += prev[prev.length - 1];
            return prev.substring(0, prev.length - 1);
          });

          if (rest.length === value.length) {
            clearInterval(intervalDecreasing.current);
            // 改 currentIndex
            setCurrentIndex((currentIndex + 1) % items.length);
          }
        }, decreasingTick);
      }, duration);
    };

    useEffect(() => {
      setCurrentText("");
      increasingTicking();

      return () => {
        clearInterval(intervalIncreasing.current);
        clearInterval(intervalDecreasing.current);
        clearTimeout(timer.current);
      };
    }, [currentIndex]);

    return <div className={clsx(className)}>{currentText}</div>;
  }
);

export default TypingTypography;
