import DiscoverScene from './DiscoverScene';
import FriendsScene from './FriendsScene';
import GuidePhoneScene from './GuidePhoneScene';
import TourRouteScene from './TourRouteScene';

const FeatureScene = ({ feature }) => {
  if (feature.image) {
    return <FriendsScene image={feature.image} imageAlt={feature.imageAlt} />;
  }

  if (feature.id === 'guide') {
    return <GuidePhoneScene />;
  }

  if (feature.id === 'tour') {
    return <TourRouteScene />;
  }

  return <DiscoverScene />;
};

export default FeatureScene;
