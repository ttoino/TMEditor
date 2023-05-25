import React, { useEffect, useRef, useMemo } from "react";

const useResizeAnimation = (
    ref: React.RefObject<HTMLElement>,
    animateWidth: boolean = true,
    animateHeight: boolean = true
) => {
    const size = useRef({ width: 0, height: 0 });

    const observer = useMemo(() => {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const element = entry.target as HTMLElement;
                const width = element.scrollWidth;
                const height = element.scrollHeight;

                const keyframes: any[] = [{}, {}];

                if (animateWidth && width !== size.current.width) {
                    keyframes[0].width = `${size.current.width}px`;
                    keyframes[1].width = `${width}px`;
                }
                if (animateHeight && height !== size.current.height) {
                    keyframes[0].height = `${size.current.height}px`;
                    keyframes[1].height = `${height}px`;
                }

                if (!keyframes[0].width && !keyframes[0].height) continue;

                observer.unobserve(element);
                const animation = element.animate(keyframes, {
                    duration: 200,
                    easing: "ease-in-out",
                });
                animation.onfinish = () => {
                    observer.observe(element);
                    size.current = { width, height };
                };
            }
        });

        return observer;
    }, [animateWidth, animateHeight]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        size.current = {
            width: element.scrollWidth,
            height: element.scrollHeight,
        };
        element.style.overflow = "clip";
        observer.observe(element);

        return () => observer.unobserve(element);
    }, [ref, observer]);
};

export default useResizeAnimation;
