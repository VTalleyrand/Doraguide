import FriendsScene from './FriendsScene';
import GuidePhoneScene from './GuidePhoneScene';
import ShakeMapScene from './ShakeMapScene';
import TourRouteScene from './TourRouteScene';

const FeatureScene = ({ feature }) => {
  if (feature.image) {
    return (
      <FriendsScene
        image={feature.image}
        imageAlt={feature.imageAlt}
        variant={feature.id}
      />
    );
  }

  if (feature.id === 'guide') {
    return <GuidePhoneScene />;
  }

  if (feature.id === 'tour') {
    return <ShakeMapScene />;
  }

  if (feature.id === 'discover') {
    return <TourRouteScene />;
  }

  return null;
};

export default FeatureScene;
