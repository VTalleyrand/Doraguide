const FriendsScene = ({ image, imageAlt }) => (
  <div className="feature-scene feature-scene--friends">
    <div className="feature-scene__stage">
      <div className="feature-scene__image-wrap">
        <img src={image} alt={imageAlt} />
      </div>
    </div>
  </div>
);

export default FriendsScene;
