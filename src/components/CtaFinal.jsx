import { useEffect, useState } from 'react';
import {
  Alignment,
  EventType,
  Fit,
  Layout,
  useRive,
} from '@rive-app/react-canvas';
import mapCharacter from '../assets/mapcharacter.riv?url';
import './CtaFinal.css';

const CtaFinal = () => {
  const [playbackConfig, setPlaybackConfig] = useState(null);
  const { RiveComponent, rive } = useRive(
    {
      src: mapCharacter,
      autoplay: false,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
      onRiveReady: (riveInstance) => {
        const artboard = riveInstance.contents?.artboards?.[0];
        const firstStateMachine = artboard?.stateMachines?.[0]?.name;
        const firstAnimation = artboard?.animations?.[0];

        if (firstStateMachine) {
          setPlaybackConfig({
            type: 'stateMachine',
            name: firstStateMachine,
          });
          return;
        }

        if (firstAnimation) {
          setPlaybackConfig({
            type: 'animation',
            name: firstAnimation,
          });
        }
      },
    },
    {
      shouldUseIntersectionObserver: false,
    }
  );

  useEffect(() => {
    if (!rive || !playbackConfig) return;

    const resetParams =
      playbackConfig.type === 'stateMachine'
        ? { stateMachines: playbackConfig.name, autoplay: true }
        : { animations: playbackConfig.name, autoplay: true };

    rive.reset(resetParams);

    if (playbackConfig.type !== 'animation') return;

    const restartAnimation = () => {
      rive.reset({
        animations: playbackConfig.name,
        autoplay: true,
      });
    };

    rive.on(EventType.Stop, restartAnimation);

    return () => {
      rive.off(EventType.Stop, restartAnimation);
    };
  }, [rive, playbackConfig]);

  return (
    <section className="cta-final" id="get-dora">
      <div className="cta-final__inner">
        <div className="cta-final__animation" aria-hidden="true">
          <RiveComponent className="cta-final__animation-canvas" />
        </div>
        <h2 className="cta-final__title">
          Let Dora guide you through your next walk.
        </h2>
        <p className="cta-final__body">
          Join early access and discover cities at your own pace.
        </p>
        <div className="cta-final__actions">
          {/* <button className="primary-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' }}
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on iOS
          </button> */}
          <a
            className="primary-btn"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdJFFJN6tyLpKh5g0WvLWzTQ1IOtyw48im_OGJqYCILGNcp6w/viewform"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' }}
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Early Access
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaFinal;
