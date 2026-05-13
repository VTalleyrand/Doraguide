import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildActiveOrthogonalRoutePath,
  graphPathDistance,
} from './tourRouteUtils';

const STAGE_ASPECT_RATIO = 42 / 24;

const discoverRouteNodes = {
  'top-edge-1': { x: 16.43, y: 10 },
  'top-edge-2': { x: 37.86, y: 10 },
  'top-edge-3': { x: 59.29, y: 10 },
  'top-edge-4': { x: 80.71, y: 10 },
  'row-1-edge-left': { x: 5.71, y: 28.75 },
  'row-1-col-1': { x: 16.43, y: 28.75 },
  'row-1-col-2': { x: 37.86, y: 28.75 },
  courtyard: { x: 59.29, y: 28.75 },
  'row-1-col-4': { x: 80.71, y: 28.75 },
  'row-1-edge-right': { x: 94.29, y: 28.75 },
  'row-2-edge-left': { x: 5.71, y: 66.25 },
  'row-2-col-1': { x: 16.43, y: 66.25 },
  'row-2-col-2': { x: 37.86, y: 66.25 },
  'row-2-col-3': { x: 59.29, y: 66.25 },
  'row-2-col-4': { x: 80.71, y: 66.25 },
  'row-2-edge-right': { x: 94.29, y: 66.25 },
  'bottom-edge-1': { x: 16.43, y: 90 },
  'bottom-edge-2': { x: 37.86, y: 90 },
  'bottom-edge-3': { x: 59.29, y: 90 },
  'bottom-edge-4': { x: 80.71, y: 90 },
};

const discoverRouteEdges = [
  ['row-1-edge-left', 'row-1-col-1'],
  ['row-1-col-1', 'row-1-col-2'],
  ['row-1-col-2', 'courtyard'],
  ['courtyard', 'row-1-col-4'],
  ['row-1-col-4', 'row-1-edge-right'],
  ['row-2-edge-left', 'row-2-col-1'],
  ['row-2-col-1', 'row-2-col-2'],
  ['row-2-col-2', 'row-2-col-3'],
  ['row-2-col-3', 'row-2-col-4'],
  ['row-2-col-4', 'row-2-edge-right'],
  ['top-edge-1', 'row-1-col-1'],
  ['row-1-col-1', 'row-2-col-1'],
  ['row-2-col-1', 'bottom-edge-1'],
  ['top-edge-2', 'row-1-col-2'],
  ['row-1-col-2', 'row-2-col-2'],
  ['row-2-col-2', 'bottom-edge-2'],
  ['top-edge-3', 'courtyard'],
  ['courtyard', 'row-2-col-3'],
  ['row-2-col-3', 'bottom-edge-3'],
  ['top-edge-4', 'row-1-col-4'],
  ['row-1-col-4', 'row-2-col-4'],
  ['row-2-col-4', 'bottom-edge-4'],
];

const discoverDestinationStyles = [
  {
    id: 'courtyard',
    routeNodeId: 'destination-courtyard',
    colorClass: 'feature-scene__discover-marker--orange',
  },
  {
    id: 'lookout',
    routeNodeId: 'destination-lookout',
    colorClass: 'feature-scene__discover-marker--green',
  },
];

const getEdgeMidpoint = ([fromNodeId, toNodeId]) => {
  const fromNode = discoverRouteNodes[fromNodeId];
  const toNode = discoverRouteNodes[toNodeId];

  return {
    x: (fromNode.x + toNode.x) / 2,
    y: (fromNode.y + toNode.y) / 2,
    attachEdge: [fromNodeId, toNodeId],
  };
};

const discoverDestinationCandidates = discoverRouteEdges.map((edge) =>
  getEdgeMidpoint(edge)
);

const buildDestinationsFromCandidates = (candidates) =>
  candidates.map((candidate, index) => ({
    ...discoverDestinationStyles[index],
    ...candidate,
  }));

const areDestinationCandidatesValid = (firstCandidate, secondCandidate) =>
  Math.abs(firstCandidate.x - secondCandidate.x) > 0.1 &&
  Math.abs(firstCandidate.y - secondCandidate.y) > 0.1;

const shuffleItems = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
};

const createDefaultDestinations = () =>
  buildDestinationsFromCandidates([
    getEdgeMidpoint(['row-1-col-2', 'courtyard']),
    getEdgeMidpoint(['row-2-col-4', 'bottom-edge-4']),
  ]);

const createRandomDestinations = () => {
  const shuffledCandidates = shuffleItems(discoverDestinationCandidates);

  for (const firstCandidate of shuffledCandidates) {
    const secondCandidate = shuffledCandidates.find((candidate) =>
      areDestinationCandidatesValid(firstCandidate, candidate)
    );

    if (secondCandidate) {
      return buildDestinationsFromCandidates([firstCandidate, secondCandidate]);
    }
  }

  return createDefaultDestinations();
};

const toStagePoint = (event, element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100,
  };
};

const scalePoint = (point, xScale) => ({
  x: point.x * xScale,
  y: point.y,
});

const getProjectedPointOnEdge = (point, fromNode, toNode, xScale = 1) => {
  const scaledPoint = scalePoint(point, xScale);
  const scaledFromNode = scalePoint(fromNode, xScale);
  const scaledToNode = scalePoint(toNode, xScale);
  const vectorX = scaledToNode.x - scaledFromNode.x;
  const vectorY = toNode.y - fromNode.y;
  const lengthSquared = vectorX * vectorX + vectorY * vectorY;

  if (!lengthSquared) {
    return {
      x: fromNode.x,
      y: fromNode.y,
      progress: 0,
      distance: Math.hypot(
        scaledPoint.x - scaledFromNode.x,
        scaledPoint.y - scaledFromNode.y
      ),
    };
  }

  const progress = Math.max(
    0,
    Math.min(
      1,
      ((scaledPoint.x - scaledFromNode.x) * vectorX +
        (scaledPoint.y - scaledFromNode.y) * vectorY) /
        lengthSquared
    )
  );
  const scaledX = scaledFromNode.x + vectorX * progress;
  const y = scaledFromNode.y + vectorY * progress;
  const x = scaledX / xScale;

  return {
    x,
    y,
    progress,
    distance: Math.hypot(scaledPoint.x - scaledX, scaledPoint.y - y),
  };
};

const getNearestRoadPoint = (point, xScale = STAGE_ASPECT_RATIO) =>
  discoverRouteEdges
    .map(([fromNodeId, toNodeId]) => {
      const projection = getProjectedPointOnEdge(
        point,
        discoverRouteNodes[fromNodeId],
        discoverRouteNodes[toNodeId],
        xScale
      );

      return {
        ...projection,
        attachEdge: [fromNodeId, toNodeId],
      };
    })
    .sort((a, b) => a.distance - b.distance)[0];

const DEFAULT_PERSON_POINT = { x: 28, y: 46 };

const DiscoverScene = () => {
  const stageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [personLocation, setPersonLocation] = useState(() =>
    getNearestRoadPoint(DEFAULT_PERSON_POINT)
  );
  const [routedPersonLocation, setRoutedPersonLocation] = useState(() =>
    getNearestRoadPoint(DEFAULT_PERSON_POINT)
  );
  const [destinations, setDestinations] = useState(() =>
    createDefaultDestinations()
  );
  const personLocationRef = useRef(personLocation);

  useEffect(() => {
    personLocationRef.current = personLocation;
  }, [personLocation]);

  useEffect(() => {
    setDestinations(createRandomDestinations());
  }, []);

  const routeNodes = useMemo(
    () => ({
      ...discoverRouteNodes,
      ...Object.fromEntries(
        destinations.map((destination) => [
          destination.routeNodeId,
          {
            x: destination.x,
            y: destination.y,
          },
        ])
      ),
      person: {
        x: routedPersonLocation.x,
        y: routedPersonLocation.y,
      },
    }),
    [destinations, routedPersonLocation]
  );

  const routeEdgesWithoutPerson = useMemo(
    () => [
      ...discoverRouteEdges,
      ...destinations.flatMap((destination) => [
        [destination.attachEdge[0], destination.routeNodeId],
        [destination.routeNodeId, destination.attachEdge[1]],
      ]),
    ],
    [destinations]
  );

  const routeEdgesWithPerson = useMemo(
    () => [
      ...routeEdgesWithoutPerson,
      [routedPersonLocation.attachEdge[0], 'person'],
      ['person', routedPersonLocation.attachEdge[1]],
    ],
    [routeEdgesWithoutPerson, routedPersonLocation]
  );

  const orderedDestinations = useMemo(() => {
    const [firstDestination, secondDestination] = destinations;
    const firstDistance = graphPathDistance(
      'person',
      firstDestination.routeNodeId,
      routeNodes,
      routeEdgesWithPerson
    );
    const secondDistance = graphPathDistance(
      'person',
      secondDestination.routeNodeId,
      routeNodes,
      routeEdgesWithPerson
    );

    const personScreen = scalePoint(routeNodes.person, STAGE_ASPECT_RATIO);
    const tieBreak = (dest) => {
      const q = scalePoint(
        routeNodes[dest.routeNodeId],
        STAGE_ASPECT_RATIO
      );
      return Math.hypot(q.x - personScreen.x, q.y - personScreen.y);
    };

    if (!Number.isFinite(firstDistance) || !Number.isFinite(secondDistance)) {
      if (Number.isFinite(firstDistance)) return destinations;
      if (Number.isFinite(secondDistance)) {
        return [secondDestination, firstDestination];
      }
      return destinations;
    }

    if (firstDistance < secondDistance) return destinations;
    if (secondDistance < firstDistance) {
      return [secondDestination, firstDestination];
    }

    return tieBreak(firstDestination) <= tieBreak(secondDestination)
      ? destinations
      : [secondDestination, firstDestination];
  }, [destinations, routeNodes, routeEdgesWithPerson]);

  const activeRoutePaths = useMemo(
    () =>
      orderedDestinations.map((destination, index) => {
        const startRouteNodeId =
          index === 0
            ? 'person'
            : orderedDestinations[index - 1].routeNodeId;

        const edgesForLeg =
          index === 0 ? routeEdgesWithPerson : routeEdgesWithoutPerson;

        return buildActiveOrthogonalRoutePath(
          { routeNodeId: startRouteNodeId },
          { routeNodeId: destination.routeNodeId },
          routeNodes,
          edgesForLeg
        );
      }),
    [orderedDestinations, routeEdgesWithPerson, routeEdgesWithoutPerson, routeNodes]
  );

  const updatePersonLocation = (event) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nextLocation = getNearestRoadPoint(
      toStagePoint(event, stageRef.current),
      rect.width / rect.height
    );
    personLocationRef.current = nextLocation;
    setPersonLocation(nextLocation);
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const handleWindowPointerMove = (event) => {
      updatePersonLocation(event);
    };

    const handleWindowPointerUp = (event) => {
      updatePersonLocation(event);
      setRoutedPersonLocation(personLocationRef.current);
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (event) => {
    event.preventDefault();
    setIsDragging(true);
    updatePersonLocation(event);
  };

  return (
    <div className="feature-scene feature-scene--discover">
      <div
        ref={stageRef}
        className="feature-scene__stage"
        onPointerDown={handlePointerDown}
      >
        <div className="feature-scene__streets" />
        <svg
          className="feature-scene__discover-map"
          viewBox="0 0 420 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {!isDragging &&
            activeRoutePaths.map((pathD, index) => (
              <g key={`${orderedDestinations[index].id}-route`}>
                <path
                  className="feature-scene__discover-route-outline"
                  d={pathD}
                />
                <path className="feature-scene__discover-route" d={pathD} />
              </g>
            ))}
        </svg>
        <button
          type="button"
          className={`feature-scene__person ${isDragging ? 'is-dragging' : ''}`}
          style={{
            left: `${personLocation.x}%`,
            top: `${personLocation.y}%`,
          }}
          onPointerDown={handlePointerDown}
          aria-label="Drag your location to route to the hidden courtyard"
        >
          <span className="feature-scene__person-head" />
          <span className="feature-scene__person-body" />
        </button>
        {destinations.map((destination) => {
          const markerNode = routeNodes[destination.routeNodeId];

          return (
            <div
              key={destination.id}
              className={`feature-scene__discover-marker ${destination.colorClass}`}
              style={{
                left: `${markerNode.x}%`,
                top: `${markerNode.y}%`,
              }}
              aria-hidden="true"
            >
              <span />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverScene;
