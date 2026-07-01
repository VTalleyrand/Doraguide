import iphoneMockup from '../../assets/images/iphone_mockup.png';
import discoverVideo from '../../assets/videos/discover.mp4';

const GuidePhoneScene = () => (
  <div className="feature-scene feature-scene--guide">
    <div className="feature-scene__phone">
      <video
        className="feature-scene__phone-video"
        src={discoverVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <img
        className="feature-scene__phone-frame"
        src={iphoneMockup}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
);

export default GuidePhoneScene;
