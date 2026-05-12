import { useMemo, useState } from 'react';
import { streetLayouts, tourStops } from './tourRouteData';
import {
  buildActiveRoutePath,
  buildPathForNodeIds,
  getRandomStopPlacements,
  getRandomStreetLayout,
  getRandomUserLocationStart,
} from './tourRouteUtils';

const TourRouteScene = () => {
  const [selectedStopIds, setSelectedStopIds] = useState([]);
  const [drawingSegmentId, setDrawingSegmentId] = useState(null);
  const [streetLayout] = useState(() => getRandomStreetLayout(streetLayouts));
  const [userLocationStart] = useState(() =>
    getRandomUserLocationStart(streetLayout)
  );
  const [slotByStopId] = useState(() => getRandomStopPlacements(streetLayout));

  const selectedStops = useMemo(
    () =>
      selectedStopIds
        .map((stopId) => {
          const stop = tourStops.find((item) => item.id === stopId);
          const slot = slotByStopId[stopId];
          if (!stop || !slot) return null;
          return { ...stop, ...slot };
        })
        .filter(Boolean),
    [selectedStopIds, slotByStopId]
  );

  const routeNodes = useMemo(
    () => ({
      ...streetLayout.nodes,
      [userLocationStart.routeNodeId]: {
        x: userLocationStart.x,
        y: userLocationStart.y,
      },
    }),
    [streetLayout, userLocationStart]
  );

  const routeEdges = useMemo(
    () => [
      ...streetLayout.edges,
      [userLocationStart.attachEdge[0], userLocationStart.routeNodeId],
      [userLocationStart.routeNodeId, userLocationStart.attachEdge[1]],
    ],
    [streetLayout, userLocationStart]
  );

  const routeSegments = useMemo(() => {
    if (selectedStops.length < 1) return [];
    return selectedStops.map((currentStop, index) => {
      const previousStop =
        index === 0 ? userLocationStart : selectedStops[index - 1];
      return {
        id: `${previousStop.id}->${currentStop.id}`,
        d: buildActiveRoutePath(previousStop, currentStop, routeNodes, routeEdges),
      };
    });
  }, [routeEdges, routeNodes, selectedStops, userLocationStart]);

  const handleStopSelect = (stopId) => {
    setSelectedStopIds((current) => {
      if (current.includes(stopId)) {
        setDrawingSegmentId(null);
        return current.filter((id) => id !== stopId);
      }
      const previousStopId =
        current.length === 0 ? userLocationStart.id : current[current.length - 1];
      setDrawingSegmentId(`${previousStopId}->${stopId}`);
      return [...current, stopId];
    });
  };

  const userLocationNode = routeNodes[userLocationStart.routeNodeId];

  return (
    <div className="feature-scene feature-scene--tour">
      <div className="feature-scene__stage">
        <svg
          className="feature-scene__street-map"
          viewBox="0 0 420 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {streetLayout.paths.map((nodeIds) => {
            const pathD = buildPathForNodeIds(nodeIds, 11, streetLayout.nodes);
            return (
              <g key={nodeIds.join('-')}>
                <path className="feature-scene__street-map-road-base" d={pathD} />
                <path className="feature-scene__street-map-road" d={pathD} />
              </g>
            );
          })}
        </svg>
        <svg
          className="feature-scene__route"
          viewBox="0 0 420 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {routeSegments.map((segment) => {
            const isDrawing = drawingSegmentId === segment.id;
            return (
              <g key={segment.id}>
                <path
                  d={segment.d}
                  className={`feature-scene__route-outline ${
                    isDrawing ? 'is-drawing' : ''
                  }`}
                  pathLength={isDrawing ? 1 : undefined}
                />
                <path
                  d={segment.d}
                  className={`feature-scene__route-core ${
                    isDrawing ? 'is-drawing' : ''
                  }`}
                  pathLength={isDrawing ? 1 : undefined}
                  onAnimationEnd={() => {
                    if (drawingSegmentId === segment.id) {
                      setDrawingSegmentId(null);
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>
        <span
          className="feature-scene__user-location"
          aria-label="Your location starting point"
          style={{
            left: `${userLocationNode.x}%`,
            top: `${userLocationNode.y}%`,
          }}
        />
        {tourStops.map((stop) => {
          const slot = slotByStopId[stop.id];
          if (!slot) return null;
          const markerNode = routeNodes[slot.routeNodeId];
          if (!markerNode) return null;
          const selectionIndex = selectedStopIds.indexOf(stop.id);
          const isSelected = selectionIndex !== -1;
          return (
            <button
              key={stop.id}
              type="button"
              className={`feature-scene__route-stop ${stop.markerClass} ${
                isSelected ? 'is-selected' : ''
              }`}
              style={{
                left: `${markerNode.x}%`,
                top: `${markerNode.y}%`,
              }}
              onClick={() => handleStopSelect(stop.id)}
              aria-pressed={isSelected}
              aria-label={`Select ${stop.label} stop`}
            >
              <span className="feature-scene__route-point">D</span>
              {isSelected ? (
                <span className="feature-scene__route-order" aria-hidden="true">
                  {selectionIndex + 1}
                </span>
              ) : (
                <span className="feature-scene__route-label">{stop.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TourRouteScene;
