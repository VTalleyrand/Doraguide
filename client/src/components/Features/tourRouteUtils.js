import { markerPlacementRules, tourStops } from './tourRouteData';

const toSvgPoint = (point) => ({
  x: (point.x / 100) * 420,
  y: (point.y / 100) * 220,
});

export const getRandomStreetLayout = (layouts) =>
  layouts[Math.floor(Math.random() * layouts.length)];

export const getRandomUserLocationStart = (layout) => {
  const { edges, nodes } = layout;
  const [fromNodeId, toNodeId] =
    edges[Math.floor(Math.random() * edges.length)];
  const fromNode = nodes[fromNodeId];
  const toNode = nodes[toNodeId];
  const progress = 0.16 + Math.random() * 0.68;

  return {
    id: 'user-location',
    routeNodeId: 'user-location',
    attachEdge: [fromNodeId, toNodeId],
    x: fromNode.x + (toNode.x - fromNode.x) * progress,
    y: fromNode.y + (toNode.y - fromNode.y) * progress,
  };
};

const getNodeDistance = (fromNodeId, toNodeId, nodes) => {
  const fromNode = nodes[fromNodeId];
  const toNode = nodes[toNodeId];
  if (!fromNode || !toNode) return Infinity;
  const dx = fromNode.x - toNode.x;
  const dy = fromNode.y - toNode.y;
  return Math.hypot(dx, dy);
};

const buildRoundedPath = (points, cornerRadius = 14) => {
  if (!points || points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1];

    const inVectorX = current.x - previous.x;
    const inVectorY = current.y - previous.y;
    const outVectorX = next.x - current.x;
    const outVectorY = next.y - current.y;

    const inLength = Math.hypot(inVectorX, inVectorY);
    const outLength = Math.hypot(outVectorX, outVectorY);
    if (!inLength || !outLength) continue;

    const radius = Math.min(cornerRadius, inLength * 0.45, outLength * 0.45);
    const inUnitX = inVectorX / inLength;
    const inUnitY = inVectorY / inLength;
    const outUnitX = outVectorX / outLength;
    const outUnitY = outVectorY / outLength;

    const entryPoint = {
      x: current.x - inUnitX * radius,
      y: current.y - inUnitY * radius,
    };
    const exitPoint = {
      x: current.x + outUnitX * radius,
      y: current.y + outUnitY * radius,
    };

    path += ` L ${entryPoint.x} ${entryPoint.y}`;
    path += ` Q ${current.x} ${current.y} ${exitPoint.x} ${exitPoint.y}`;
  }

  const lastPoint = points[points.length - 1];
  path += ` L ${lastPoint.x} ${lastPoint.y}`;
  return path;
};

export const buildPathForNodeIds = (nodeIds, cornerRadius = 14, nodes) => {
  const points = nodeIds
    .map((nodeId) => nodes[nodeId])
    .filter(Boolean)
    .map(toSvgPoint);
  return buildRoundedPath(points, cornerRadius);
};

const findStreetRoute = (fromNodeId, toNodeId, nodes, edges) => {
  if (fromNodeId === toNodeId) return [fromNodeId];

  const nodeIds = Object.keys(nodes);
  const distances = Object.fromEntries(
    nodeIds.map((nodeId) => [nodeId, Infinity])
  );
  const previous = {};
  const unvisited = new Set(nodeIds);
  distances[fromNodeId] = 0;

  while (unvisited.size > 0) {
    let currentNodeId = null;
    let shortestDistance = Infinity;

    unvisited.forEach((nodeId) => {
      if (distances[nodeId] < shortestDistance) {
        shortestDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    });

    if (!currentNodeId || currentNodeId === toNodeId) break;
    unvisited.delete(currentNodeId);

    edges.forEach(([fromEdgeNodeId, toEdgeNodeId]) => {
      const neighborNodeId =
        fromEdgeNodeId === currentNodeId
          ? toEdgeNodeId
          : toEdgeNodeId === currentNodeId
            ? fromEdgeNodeId
            : null;

      if (!neighborNodeId || !unvisited.has(neighborNodeId)) return;

      const nextDistance =
        distances[currentNodeId] +
        getNodeDistance(currentNodeId, neighborNodeId, nodes);
      if (nextDistance < distances[neighborNodeId]) {
        distances[neighborNodeId] = nextDistance;
        previous[neighborNodeId] = currentNodeId;
      }
    });
  }

  const route = [];
  let currentNodeId = toNodeId;

  while (currentNodeId) {
    route.unshift(currentNodeId);
    if (currentNodeId === fromNodeId) break;
    currentNodeId = previous[currentNodeId];
  }

  return route[0] === fromNodeId ? route : [fromNodeId, toNodeId];
};

const shuffleItems = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
};

const areMarkersWellSpread = (nodeIds, nodes) => {
  const markerNodes = nodeIds.map((nodeId) => nodes[nodeId]).filter(Boolean);
  if (markerNodes.length !== tourStops.length) return false;

  const hasEnoughPairSpacing = markerNodes.every((node, index) =>
    markerNodes
      .slice(index + 1)
      .every(
        (otherNode) =>
          Math.hypot(node.x - otherNode.x, node.y - otherNode.y) >=
          markerPlacementRules.minimumSpacing
      )
  );
  if (!hasEnoughPairSpacing) return false;

  const xs = markerNodes.map((node) => node.x);
  const ys = markerNodes.map((node) => node.y);
  return (
    Math.max(...xs) - Math.min(...xs) >= markerPlacementRules.minimumXRange &&
    Math.max(...ys) - Math.min(...ys) >= markerPlacementRules.minimumYRange
  );
};

export const getRandomStopPlacements = (layout) => {
  const candidateNodeIds = Object.keys(layout.nodes);

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const placementNodeIds = shuffleItems(candidateNodeIds).slice(
      0,
      tourStops.length
    );
    if (!areMarkersWellSpread(placementNodeIds, layout.nodes)) continue;

    return tourStops.reduce((acc, stop, index) => {
      acc[stop.id] = { routeNodeId: placementNodeIds[index] };
      return acc;
    }, {});
  }

  const fallbackNodeIds = [
    'stop-nw',
    'stop-ne',
    'stop-sw',
    'stop-se',
    'stop-center',
  ];
  return tourStops.reduce((acc, stop, index) => {
    acc[stop.id] = { routeNodeId: fallbackNodeIds[index] };
    return acc;
  }, {});
};

export const buildActiveRoutePath = (fromStop, toStop, nodes, edges) => {
  if (!fromStop || !toStop) return '';
  return buildPathForNodeIds(
    findStreetRoute(fromStop.routeNodeId, toStop.routeNodeId, nodes, edges),
    12,
    nodes
  );
};
