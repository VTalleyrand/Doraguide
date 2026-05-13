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

/** Sum of edge weights along the shortest graph path; Infinity if unreachable or invalid. */
export const graphPathDistance = (fromNodeId, toNodeId, nodes, edges) => {
  if (fromNodeId === toNodeId) return 0;
  const nodeIds = findStreetRoute(fromNodeId, toNodeId, nodes, edges);
  if (nodeIds.length < 2 || nodeIds[0] !== fromNodeId || nodeIds[nodeIds.length - 1] !== toNodeId) {
    return Infinity;
  }
  let sum = 0;
  for (let i = 0; i < nodeIds.length - 1; i += 1) {
    sum += getNodeDistance(nodeIds[i], nodeIds[i + 1], nodes);
  }
  return sum;
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

/** Drop middle points that sit on the same straight H/V run (reduces miter / stub artifacts). */
const simplifyAxisAlignedPoints = (points, eps = 0.35) => {
  if (points.length <= 2) return points;
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i += 1) {
    const a = out[out.length - 1];
    const b = points[i];
    const c = points[i + 1];
    const onHorizontalRun =
      Math.abs(a.y - b.y) < eps && Math.abs(b.y - c.y) < eps;
    const onVerticalRun =
      Math.abs(a.x - b.x) < eps && Math.abs(b.x - c.x) < eps;
    if (!onHorizontalRun && !onVerticalRun) out.push(b);
  }
  out.push(points[points.length - 1]);
  return out;
};

/** Straight line segments only (horizontal / vertical), for grid-aligned UI paths. */
export const buildPolylinePathForNodeIds = (nodeIds, nodes) => {
  const points = nodeIds
    .map((nodeId) => nodes[nodeId])
    .filter(Boolean)
    .map(toSvgPoint);
  if (points.length < 2) return '';
  const deduped = points.filter(
    (point, index) =>
      index === 0 ||
      Math.abs(point.x - points[index - 1].x) > 0.01 ||
      Math.abs(point.y - points[index - 1].y) > 0.01
  );
  if (deduped.length < 2) return '';
  const simplified = simplifyAxisAlignedPoints(deduped);
  if (simplified.length < 2) return '';
  const minSeg = 0.02;
  let path = `M ${simplified[0].x} ${simplified[0].y}`;
  for (let index = 1; index < simplified.length; index += 1) {
    const prev = simplified[index - 1];
    const current = simplified[index];
    const dx = Math.abs(current.x - prev.x);
    const dy = Math.abs(current.y - prev.y);
    if (dx > minSeg && dy > minSeg) {
      const cx = prev.x;
      const cy = current.y;
      const leg1 = Math.hypot(cx - prev.x, cy - prev.y);
      const leg2 = Math.hypot(current.x - cx, current.y - cy);
      if (leg1 > minSeg && leg2 > minSeg) {
        path += ` L ${cx} ${cy} L ${current.x} ${current.y}`;
      } else if (leg2 > minSeg) {
        path += ` L ${current.x} ${current.y}`;
      } else if (leg1 > minSeg) {
        path += ` L ${cx} ${cy}`;
      } else {
        path += ` L ${current.x} ${current.y}`;
      }
    } else {
      path += ` L ${current.x} ${current.y}`;
    }
  }
  return path;
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

/** Shortest path on the street graph as straight H/V segments (no corner rounding). */
export const buildActiveOrthogonalRoutePath = (fromStop, toStop, nodes, edges) => {
  if (!fromStop || !toStop) return '';
  const nodeIds = findStreetRoute(
    fromStop.routeNodeId,
    toStop.routeNodeId,
    nodes,
    edges
  );
  return buildPolylinePathForNodeIds(nodeIds, nodes);
};
