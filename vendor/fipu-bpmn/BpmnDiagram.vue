<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BpmnMarker from './BpmnMarker.vue';

import { attachedWaypoints, gatewayRoute, newFlowRoute, portsForGateway } from './model.js';


const props = defineProps({
  model: { type: Object, required: true },
  selectedId: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  highlights: { type: Object, default: () => ({}) },
  connecting: { type: Boolean, default: false },
});
const emit = defineEmits(['edit-name', 'select', 'move', 'move-label', 'reshape', 'create-flow', 'background']);
const svg = ref(null);
const view = ref({ x: 0, y: 0, width: 1000, height: 700 });
const dragging = ref(null);
const markerId = `bpmn-arrow-${getCurrentInstance().uid}`;
const defaultFlows = computed(() => new Set(props.model.nodes.map(node => node.default).filter(Boolean)));
let observer;
let unitsPerPixel;
const bounds = computed(() => {
  const shapes = [...props.model.nodes, ...props.model.lanes, ...props.model.pools, ...flows.value.flatMap(f => f.waypoints.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)).map(p => ({ ...p, width: 0, height: 0 })))];
  shapes.push(...[...props.model.nodes, ...flows.value].filter(item => item.name && item.label).map(item => item.label));
  if (!shapes.length) return { x: 0, y: 0, width: 1000, height: 600 };
  const x = Math.min(...shapes.map(n => n.x)) - 45;
  const y = Math.min(...shapes.map(n => n.y)) - 55;
  return { x, y, width: Math.max(...shapes.map(n => n.x + n.width)) - x + 45, height: Math.max(...shapes.map(n => n.y + n.height)) - y + 70 };
});
function boundedOrigin(position, start, size, viewport) {
  if (viewport >= size) return start + (size - viewport) / 2;
  return Math.max(start, Math.min(position, start + size - viewport));
}
function setView(x, y, width, height) {
  if (!props.editable) {
    const box = bounds.value;
    x = boundedOrigin(x, box.x, box.width, width);
    y = boundedOrigin(y, box.y, box.height, height);
  }
  unitsPerPixel = width / svg.value.clientWidth;
  view.value = { x, y, width, height };
}
function fit() {
  unitsPerPixel = null;
  const rect = svg.value?.getBoundingClientRect();
  const box = bounds.value;
  const ratio = rect?.height ? rect.width / rect.height : box.width / box.height;
  const width = Math.max(box.width, box.height * ratio);
  const height = width / ratio;
  view.value = { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height };
}
function point(event) {
  const p = svg.value.createSVGPoint();
  p.x = event.clientX; p.y = event.clientY;
  return p.matrixTransform(svg.value.getScreenCTM().inverse());
}
function zoom(factor, anchor) {
  const old = view.value;
  const width = Math.min(bounds.value.width * 5, Math.max(200, old.width * factor));
  const actual = width / old.width;
  const center = anchor || { x: old.x + old.width / 2, y: old.y + old.height / 2 };
  setView(center.x - (center.x - old.x) * actual, center.y - (center.y - old.y) * actual, width, old.height * actual);
}
function wheel(event) {
  if (event.ctrlKey || event.metaKey) {
    if (event.deltaY) zoom(event.deltaY > 0 ? 1.1 : 0.9, point(event));
    return;
  }
  const { x, y, width, height } = view.value;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? svg.value.clientHeight : 1;
  const scale = unit / svg.value.getScreenCTM().a;
  setView(x + event.deltaX * scale, y + event.deltaY * scale, width, height);
}
function begin(event, node) {
  if (event.button !== 0) return;
  const p = point(event);
  if (node) emit('select', node.id);
  if (props.connecting && node) return;
  if (node && !props.editable) return;
  dragging.value = { id: node?.id, node, start: p, x: node?.x, y: node?.y, dx: 0, dy: 0, clientX: event.clientX, clientY: event.clientY, view: { ...view.value } };
  event.currentTarget.setPointerCapture(event.pointerId);
}
const flows = computed(() => [...props.model.flows, ...(props.model.messageFlows || [])]);
const displayedFlows = computed(() => {
  const drag = dragging.value;
  if (!drag?.node || !(drag.dx || drag.dy || drag.resizeBox)) return flows.value;
  const node = { ...drag.node, ...(drag.resizeBox || { x: drag.x + drag.dx, y: drag.y + drag.dy }) };
  return flows.value.map(flow => flow.sourceRef === node.id || flow.targetRef === node.id
    ? { ...flow, waypoints: attachedWaypoints(flow, drag.node, node) } : flow);
});
const selectedFlow = computed(() => props.editable && !props.connecting && flows.value.find(f => f.id === props.selectedId));
const gatewayPorts = computed(() => {
  const flow = selectedFlow.value;
  if (flow?.type !== 'sequenceFlow') return [];
  return ['sourceRef', 'targetRef'].flatMap(ref => {
    const node = props.model.nodes.find(n => n.id === flow[ref]);
    if (!node?.type.endsWith('Gateway')) return [];
    return portsForGateway(node, ref);
  });
});
const creationPorts = computed(() => {
  if (!props.editable || props.connecting) return [];
  const node = props.model.nodes.find(n => n.id === props.selectedId);
  return node?.type.endsWith('Gateway') ? portsForGateway(node, 'sourceRef') : [];
});
function startFlow(port, event) {
  if (event && event.button !== 0) return;
  dragging.value = { creation: port, points: [port, port] };
  if (event) svg.value.setPointerCapture(event.pointerId);
}
function previewFlow(event, drag) {
  const p = point(event);
  const target = props.model.nodes.find(n => /task$/i.test(n.type) && p.x >= n.x && p.x <= n.x + n.width && p.y >= n.y && p.y <= n.y + n.height);
  drag.target = target;
  drag.points = target ? newFlowRoute(drag.creation.node, target, drag.creation.side) : [drag.creation, p];
}
function finishFlow(port, target) {
  if (target && /task$/i.test(target.type)) emit('create-flow', { source: port.node.id, target: target.id, side: port.side });
}
function startDock(event, port) {
  if (event.button !== 0) return;
  const flow = selectedFlow.value;
  dragging.value = { id: flow.id, flow, port, points: gatewayRoute(port, flow.waypoints) };
  svg.value.setPointerCapture(event.pointerId);
}
function previewDock(event, drag) {
  const p = point(event);
  const tolerance = 12 / svg.value.getScreenCTM().a;
  let nearest, distance = Infinity;
  for (const port of gatewayPorts.value) {
    const atStart = port.ref === 'sourceRef';
    if (drag.port ? port.ref !== drag.port.ref : !drag.h.segment || drag.h.i !== (atStart ? 0 : drag.flow.waypoints.length - 2)) continue;
    const d = Math.hypot(port.x - p.x, port.y - p.y);
    if (d <= Math.max(tolerance, Math.min(port.node.width, port.node.height) / 2) && d < distance) { nearest = port; distance = d; }
  }
  const current = nearest && drag.flow.waypoints.at(nearest.ref === 'sourceRef' ? 0 : -1);
  if (!drag.port && nearest?.x === current?.x && nearest?.y === current?.y) nearest = undefined;
  drag.snapPort = nearest;
  if (drag.port || nearest) drag.points = nearest && gatewayRoute(nearest, drag.flow.waypoints);
  return !!nearest;
}
const handles = computed(() => {
  const points = selectedFlow.value?.waypoints || [];
  return points.slice(1).flatMap((b, i) => {
    const a = points[i];
    const mid = { i, segment: true, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    return i ? [{ i, ...a }, mid] : [mid];
  });
});
function snapToGrid(value) { return Math.round(value / 10) * 10; }
function adjusted(flow, h, x, y, free) {
  const points = flow.waypoints.slice();
  const a = points[h.i], b = points[h.i + 1];
  const snap = (v, axis, neighbors) => free ? Math.round(v) : neighbors.find(p => Math.abs(p[axis] - v) <= 4)?.[axis] ?? snapToGrid(v);
  const neighbors = h.segment ? [a, b] : [points[h.i - 1], b];
  const p = { x: snap(x, 'x', neighbors), y: snap(y, 'y', neighbors) };
  if (!h.segment) points[h.i] = p;
  else if (a.x !== b.x && a.y !== b.y) points.splice(h.i + 1, 0, p);
  else {
    const axis = a.x === b.x ? 'x' : 'y';
    const along = axis === 'x' ? 'y' : 'x';
    if (p[axis] === a[axis]) return points;
    // Leave a short lead at each fixed endpoint when pulling a straight arrow sideways.
    const lead = Math.sign(b[along] - a[along]) * Math.min(20, Math.abs(b[along] - a[along]) / 4);
    const first = h.i === 0, last = h.i + 2 === points.length;
    const start = { ...a, [along]: a[along] + (first ? lead : 0) };
    const end = { ...b, [along]: b[along] - (last ? lead : 0) };
    points.splice(h.i, 2, ...(first ? [a, start] : []), { ...start, [axis]: p[axis] }, { ...end, [axis]: p[axis] }, ...(last ? [end, b] : []));
  }
  return points.filter((p, i) => !i || p.x !== points[i-1].x || p.y !== points[i-1].y);
}
function startHandle(event, h) {
  if (event.button !== 0) return;
  event.currentTarget.focus();
  dragging.value = { id: selectedFlow.value.id, flow: selectedFlow.value, h, start: point(event), clientX: event.clientX, clientY: event.clientY };
  svg.value.setPointerCapture(event.pointerId);
}
function commitRoute(flow, points) {
  if (points?.length >= 2 && JSON.stringify(flow.waypoints) !== JSON.stringify(points)) emit('reshape', { id: flow.id, points });
}
function deleteWaypoint(event, h) {
  const flow = selectedFlow.value;
  if (event.repeat || flow.waypoints.length <= 2) return;
  const lastBend = flow.waypoints.length - 2;
  const index = h.segment ? Math.min(h.i + 1, lastBend) : h.i;
  // The last bend and segment disappear together. Keep Delete scoped to the route.
  if (h.i === lastBend) {
    const segment = h.segment ? event.currentTarget.previousElementSibling : event.currentTarget;
    segment.previousElementSibling.focus();
  }
  commitRoute(flow, flow.waypoints.filter((_, i) => i !== index));
}
function nudge(event, h) {
  const delta = { ArrowLeft: [-1,0], ArrowRight: [1,0], ArrowUp: [0,-1], ArrowDown: [0,1] }[event.key];
  if (!delta) return;
  event.preventDefault();
  const step = event.altKey ? 1 : 10;
  commitRoute(selectedFlow.value, adjusted(selectedFlow.value, h, h.x + delta[0]*step, h.y + delta[1]*step, event.altKey));
}
function alignment(node, axis, position, tolerance) {
  const size = axis === 'x' ? 'width' : 'height';
  let best;
  for (const other of props.model.nodes) {
    if (other.id === node.id) continue;
    for (const fraction of [0.5, 0, 1]) {
      const guide = other[axis] + other[size] * fraction;
      const origin = guide - node[size] * fraction;
      const distance = Math.abs(origin - position);
      if (distance <= tolerance && (!best || distance < best.distance)) best = { origin, guide, distance };
    }
  }
  return best;
}
const corners = { nw: 'gornji lijevi', ne: 'gornji desni', sw: 'donji lijevi', se: 'donji desni' };
const displayedNodes = computed(() => {
  const box = dragging.value?.resizeBox;
  return box ? props.model.nodes.map(node => node.id === box.id ? { ...node, ...box } : node) : props.model.nodes;
});
function resized(node, corner, dx, dy, free) {
  const left = corner.endsWith('w'), top = corner.startsWith('n');
  const snap = free ? Math.round : snapToGrid;
  const width = Math.max(60, left ? node.x + node.width - snap(node.x + dx) : snap(node.x + node.width + dx) - node.x);
  const height = Math.max(40, top ? node.y + node.height - snap(node.y + dy) : snap(node.y + node.height + dy) - node.y);
  return { id: node.id, x: left ? node.x + node.width - width : node.x, y: top ? node.y + node.height - height : node.y, width, height };
}
function startResize(event, node, corner) {
  if (event.button !== 0) return;
  dragging.value = { id: node.id, node, corner, start: point(event) };
  svg.value.setPointerCapture(event.pointerId);
}
function finishResize(node, box) {
  if (box && (box.width !== node.width || box.height !== node.height)) emit('move', { id: node.id, x: box.x, y: box.y, size: { width: box.width, height: box.height } });
}
function resizeKey(event, node, corner) {
  const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
  if (!delta) return;
  event.stopPropagation();
  event.preventDefault();
  const step = event.altKey ? 1 : 10;
  finishResize(node, resized(node, corner, delta[0] * step, delta[1] * step, true));
}
function move(event) {
  const drag = dragging.value;
  if (!drag) return;
  if (drag.creation) { previewFlow(event, drag); return; }
  if (drag.port) { previewDock(event, drag); return; }
  if (drag.label) {
    const p = point(event);
    const moved = Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) >= 3;
    drag.dx = moved ? Math.round(p.x - drag.start.x) : 0;
    drag.dy = moved ? Math.round(p.y - drag.start.y) : 0;
    return;
  }
  if (drag.corner) {
    const p = point(event);
    drag.resizeBox = resized(drag.node, drag.corner, p.x - drag.start.x, p.y - drag.start.y, event.altKey);
    return;
  }
  if (drag.flow) {
    if (Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) < 3) { drag.points = null; return; }
    if (previewDock(event, drag)) return;
    const p = point(event);
    drag.points = adjusted(drag.flow, drag.h, drag.h.x + p.x - drag.start.x, drag.h.y + p.y - drag.start.y, event.altKey);
    return;
  }
  if (drag.id) {
    const p = point(event);
    const moved = Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) >= 3;
    const x = drag.x + p.x - drag.start.x, y = drag.y + p.y - drag.start.y;
    const tolerance = 5 / svg.value.getScreenCTM().a;
    const align = moved && !event.altKey;
    const horizontal = align && alignment(drag.node, 'x', x, tolerance);
    const vertical = align && alignment(drag.node, 'y', y, tolerance);
    drag.guideX = horizontal?.guide;
    drag.guideY = vertical?.guide;
    const fallback = event.altKey ? Math.round : snapToGrid;
    drag.dx = moved ? (horizontal?.origin ?? fallback(x)) - drag.x : 0;
    drag.dy = moved ? (vertical?.origin ?? fallback(y)) - drag.y : 0;
    return;
  }
  const dx = (event.clientX - drag.clientX) * drag.view.width / svg.value.clientWidth;
  const dy = (event.clientY - drag.clientY) * drag.view.height / svg.value.clientHeight;
  setView(drag.view.x - dx, drag.view.y - dy, drag.view.width, drag.view.height);
}
function end(event) {
  const drag = dragging.value;
  if (!drag) return;
  if (drag.port || drag.h) move(event);
  dragging.value = null;
  if (svg.value.hasPointerCapture(event.pointerId)) svg.value.releasePointerCapture(event.pointerId);
  if (drag.creation) { previewFlow(event, drag); finishFlow(drag.creation, drag.target); return; }
  if (drag.label) {
    if (drag.dx || drag.dy) shiftLabel(drag.label, drag.dx, drag.dy);
    else emit('select', drag.label.id);
    return;
  }
  if (drag.corner) { finishResize(drag.node, drag.resizeBox); return; }
  if (drag.flow) { commitRoute(drag.flow, drag.points); return; }
  if (drag.id && (drag.dx || drag.dy)) emit('move', { id: drag.id, x: drag.x + drag.dx, y: drag.y + drag.dy });
  else if (!drag.id && Math.abs(event.clientX - drag.clientX) + Math.abs(event.clientY - drag.clientY) < 4) emit('background', point(event));
}
function position(node) {
  const drag = dragging.value?.id === node.id ? dragging.value : null;
  return `translate(${node.x + (drag?.dx || 0)} ${node.y + (drag?.dy || 0)})`;
}
function lines(text, width = 90) {
  const limit = Math.max(8, Math.floor(width / 5.7));
  const result = [];
  for (const word of (text || '').split(/\s+/)) {
    const last = result[result.length - 1];
    if (last && `${last} ${word}`.length <= limit) result[result.length - 1] += ` ${word}`;
    else result.push(word);
  }
  return result;
}
function externalLabel(node) {
  return node.type.endsWith('Event') || node.type.endsWith('Gateway');
}
const labels = computed(() => [...displayedFlows.value.filter(flow => flow.name && flow.waypoints.length), ...props.model.nodes.filter(node => node.name && externalLabel(node))].map(item => {
  const isFlow = !!item.waypoints;
  let box = item.label;
  if (!box && isFlow) {
    const anchor = item.waypoints[Math.floor(item.waypoints.length / 2)];
    const width = Math.max(20, item.name.length * 6);
    box = { x: anchor.x - width / 2, y: anchor.y - 20, width, height: 16 };
  }
  box ||= { x: item.x + item.width / 2 - 55, y: item.y + item.height + 8, width: 110, height: 40 };
  return { id: item.id, name: item.name, box, isFlow, lines: isFlow ? [item.name] : lines(item.name, box.width) };
}));
function shiftLabel(label, dx, dy) {
  const box = label.box;
  emit('move-label', { id: label.id, bounds: { ...box, x: box.x + dx, y: box.y + dy } });
}
function startLabel(event, label) {
  if (event.button !== 0) return;
  if (!props.editable || props.connecting) { emit('select', label.id); return; }
  dragging.value = { label, start: point(event), dx: 0, dy: 0, clientX: event.clientX, clientY: event.clientY };
  event.currentTarget.setPointerCapture(event.pointerId);
}
function labelKey(event, label) {
  const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
  if (!delta || !props.editable || props.connecting) return;
  event.preventDefault();
  const step = event.shiftKey ? 1 : 10;
  shiftLabel(label, delta[0] * step, delta[1] * step);
}
function defaultMark(flow) {
  const [a, b] = flow.waypoints;
  if (!a || !b) return '';
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const dx = (b.x - a.x) / length, dy = (b.y - a.y) / length;
  const x = a.x + dx * 12, y = a.y + dy * 12;
  return `M${x - dx * 3 - dy * 5} ${y - dy * 3 + dx * 5}L${x + dx * 3 + dy * 5} ${y + dy * 3 - dx * 5}`;
}
function routePoints(flow) {
  return (dragging.value?.id === flow.id && dragging.value.points) || flow.waypoints;
}
function visibleRoute(flow) {
  const points = routePoints(flow);
  const target = displayedNodes.value.find(node => node.id === flow.targetRef);
  if (flow.type !== 'sequenceFlow' || !target || points.length < 2) return points;
  const drag = dragging.value?.id === target.id ? dragging.value : null;
  const w = target.width / 2, h = target.height / 2;
  const cx = target.x + (drag?.dx || 0) + w, cy = target.y + (drag?.dy || 0) + h;
  function inside(x, y) {
    const dx = Math.abs(x - cx), dy = Math.abs(y - cy);
    if (target.type.endsWith('Gateway')) return dx / w + dy / h <= 1;
    if (target.type.endsWith('Event')) return Math.hypot(dx, dy) <= Math.min(w, h) - 2;
    const r = Math.min(10, w, h);
    return Math.hypot(Math.max(0, dx - w + r), Math.max(0, dy - h + r)) <= r;
  }
  // Some saved routes end on the far side of the target after crossing its interior.
  let i = points.length - 1;
  while (i >= 0 && inside(points[i].x, points[i].y)) i--;
  if (i < 0 || i === points.length - 1) return points;
  const a = points[i], b = points[i + 1];
  const dx = b.x - a.x, dy = b.y - a.y;
  let outside = 0, within = 1;
  for (let step = 0; step < 24; step++) {
    const mid = (outside + within) / 2;
    if (inside(a.x + mid * dx, a.y + mid * dy)) within = mid;
    else outside = mid;
  }
  return [...points.slice(0, i + 1), { x: a.x + within * dx, y: a.y + within * dy }];
}
function flowPoints(points) { return points.map(p => `${p.x},${p.y}`).join(' '); }
function focus(id) {
  const node = props.model.nodes.find(n => n.id === id);
  if (!node) return;
  const width = Math.min(view.value.width, 850);
  const ratio = view.value.height / view.value.width;
  setView(node.x + node.width / 2 - width / 2, node.y + node.height / 2 - width * ratio / 2, width, width * ratio);
}
function center() { return { x: view.value.x + view.value.width / 2, y: view.value.y + view.value.height / 2 }; }
function key(event, node) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (dragging.value?.creation) { finishFlow(dragging.value.creation, node); dragging.value = null; }
    else emit('select', node.id);
  }
  if (!props.editable || props.connecting) return;
  const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  if (moves[event.key]) { event.preventDefault(); const [x, y] = moves[event.key]; emit('move', { id: node.id, x: node.x + x * (event.shiftKey ? 1 : 10), y: node.y + y * (event.shiftKey ? 1 : 10) }); }
}
function resizeCanvas() {
  if (!unitsPerPixel) { fit(); return; }
  const { clientWidth, clientHeight } = svg.value;
  if (!clientWidth || !clientHeight) return;
  const old = view.value;
  const width = clientWidth * unitsPerPixel, height = clientHeight * unitsPerPixel;
  setView(old.x + (old.width - width) / 2, old.y + (old.height - height) / 2, width, height);
}
onMounted(() => { fit(); observer = new ResizeObserver(resizeCanvas); observer.observe(svg.value); });
onBeforeUnmount(() => observer?.disconnect());
watch(() => props.model.processId, () => nextTick(fit));
defineExpose({ fit, focus, center, zoomIn: () => zoom(0.8), zoomOut: () => zoom(1.25) });
</script>

<template>
  <svg ref="svg" class="fipu-bpmn-canvas" :class="{ connecting, editable, panning: dragging && !dragging.id && !dragging.label }" :viewBox="`${view.x} ${view.y} ${view.width} ${view.height}`" role="group" aria-label="BPMN dijagram procesa. Za pomicanje povucite pozadinu ili kliznite dvama prstima po dodirnoj pločici; Control i kotačić za zumiranje." @wheel.prevent="wheel" @pointerdown.self="begin($event)" @pointermove="move" @pointerup="end" @pointercancel="dragging = null" @keydown.esc="dragging = null">
    <defs><marker :id="markerId" markerWidth="8" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 8 4 0 8Z" fill="#5f7185" /></marker>
      <marker :id="markerId + '-open'" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 9 5 1 9" fill="none" stroke="#5f7185" /></marker>
    </defs>
    <g class="bpmn-pools" @pointerdown="begin($event)">
      <g v-for="pool in model.pools" :key="pool.id"><rect :x="pool.x" :y="pool.y" :width="pool.width" :height="pool.height" fill="#fff" stroke="#9babbc" /><line :x1="pool.x + 30" :x2="pool.x + 30" :y1="pool.y" :y2="pool.y + pool.height" stroke="#9babbc" /><text :transform="`translate(${pool.x + 19} ${pool.y + pool.height / 2}) rotate(-90)`" text-anchor="middle" class="pool-label">{{ pool.name }}</text></g>
      <g v-for="(lane, index) in model.lanes" :key="lane.id"><rect :x="lane.x" :y="lane.y" :width="lane.width" :height="lane.height" :fill="index % 2 ? '#f7fafc' : '#fff'" stroke="#cbd5df" /><line :x1="lane.x + 30" :x2="lane.x + 30" :y1="lane.y" :y2="lane.y + lane.height" stroke="#cbd5df" /><text :transform="`translate(${lane.x + 19} ${lane.y + lane.height / 2}) rotate(-90)`" text-anchor="middle" class="lane-label">{{ lane.name }}</text></g>
    </g>
    <g v-for="flow in displayedFlows" :key="flow.id" :data-flow-id="flow.id" class="bpmn-flow" :class="{ selected: selectedId === flow.id }" tabindex="0" role="button" :aria-label="`${flow.type === 'messageFlow' ? 'Message Flow' : 'Sequence Flow'}: ${flow.name || flow.id}`" @dblclick.stop="editable && !connecting && emit('edit-name', flow.id)" @pointerdown.stop="emit('select', flow.id)" @keydown.enter.prevent="emit('select', flow.id)" @keydown.space.prevent="emit('select', flow.id)">
      <title>{{ flow.name || flow.id }}{{ flow.condition ? ` · ${flow.condition}` : '' }}</title>
      <polyline :points="flowPoints(routePoints(flow))" fill="none" stroke="transparent" stroke-width="14" />
      <polyline class="flow-line" :stroke-dasharray="flow.type === 'messageFlow' ? '6 4' : undefined" :points="flowPoints(visibleRoute(flow))" fill="none" :stroke="selectedId === flow.id ? '#087caa' : '#5f7185'" :stroke-width="selectedId === flow.id ? 2.5 : 1.4" :marker-end="`url(#${markerId}${flow.type === 'messageFlow' ? '-open' : ''})`" />
      <path v-if="defaultFlows.has(flow.id)" :d="defaultMark(flow)" stroke="#5f7185" stroke-width="1.6" />
    </g>
    <g v-for="node in displayedNodes" :key="node.id" class="bpmn-node" :class="{ selected: selectedId === node.id, movable: editable, active: !!highlights[node.id] }" :transform="position(node)" tabindex="0" role="button" :aria-label="`${node.type}: ${node.name || node.id}`" :aria-pressed="selectedId === node.id" @pointerdown.stop="begin($event, node)" @keydown="key($event, node)" @dblclick.stop="editable ? !connecting && emit('edit-name', node.id) : focus(node.id)">
      <title>{{ node.name || node.id }} · {{ node.type }}</title>
      <rect v-if="selectedId === node.id" x="-5" y="-5" :width="node.width + 10" :height="node.height + 10" rx="8" class="selection-outline" />
      <g v-if="node.type.endsWith('Event')">
      <circle class="node-shape" :class="{ 'end-event': node.type === 'endEvent' }" :cx="node.width / 2" :cy="node.height / 2" :r="Math.min(node.width, node.height) / 2 - 2" :fill="highlights[node.id] || '#fff'" :stroke-width="node.type === 'endEvent' ? 3.5 : 1.7" />
      <circle v-if="node.type.startsWith('intermediate')" :cx="node.width / 2" :cy="node.height / 2" :r="Math.min(node.width, node.height) / 2 - 5" fill="none" stroke="#536c82" />
      <BpmnMarker :type="node.timerDuration != null ? 'timerCatch' : node.terminate ? 'terminateEnd' : node.type" :x="node.width * .2" :y="node.height * .2" :width="node.width * .6" :height="node.height * .6" color="#253d54" />
      </g>
      <g v-else-if="node.type.endsWith('Gateway')">
        <polygon class="node-shape" :points="`${node.width / 2},0 ${node.width},${node.height / 2} ${node.width / 2},${node.height} 0,${node.height / 2}`" :fill="highlights[node.id] || '#fff'" />
        <BpmnMarker :type="node.type" :x="node.width * .2" :y="node.height * .2" :width="node.width * .6" :height="node.height * .6" color="#253d54" />
      </g>
      <g v-else>
        <rect class="node-shape" x="0" y="0" :width="node.width" :height="node.height" rx="10" :fill="highlights[node.id] || '#fff'" />
        <BpmnMarker :type="node.type" x="8" y="7" width="18" height="18" color="#36536b" />
        <text class="node-label" :x="node.width / 2" :y="Math.max(31, node.height / 2 - (lines(node.name, node.width - 14).length - 1) * 6 + 7)" text-anchor="middle"><tspan v-for="(line, i) in lines(node.name, node.width - 14)" :key="i" :x="node.width / 2" :dy="i ? 12 : 0">{{ line }}</tspan></text>
        <g v-if="editable && !connecting && selectedId === node.id">
          <g v-for="(label, corner) in corners" :key="corner" class="resize-handle" :style="{ cursor: ['nw','se'].includes(corner) ? 'nwse-resize' : 'nesw-resize' }" :transform="`translate(${corner.endsWith('w') ? 0 : node.width} ${corner.startsWith('n') ? 0 : node.height})`" tabindex="0" role="button" :aria-label="'Promijeni veličinu: ' + label + ' kut'" @pointerdown.stop="startResize($event, node, corner)" @keydown="resizeKey($event, node, corner)" @dblclick.stop>
            <rect x="-8" y="-8" width="16" height="16" fill="transparent" />
            <rect x="-3.5" y="-3.5" width="7" height="7" fill="white" stroke="#087caa" stroke-width="1.5" />
          </g>
        </g>
      </g>
    </g>
    <g class="external-labels">
      <text v-for="label in labels" :key="label.id" :class="label.isFlow ? 'flow-label' : 'node-label'" :data-label-id="label.id"
        :pointer-events="editable && !connecting || label.isFlow ? 'bounding-box' : 'none'" :tabindex="editable && !connecting ? 0 : undefined"
        :aria-label="'Oznaka: ' + label.name" :x="label.box.x + label.box.width / 2" :y="label.box.y + (label.isFlow ? 12 : 11)"
        :transform="dragging?.label?.id === label.id ? `translate(${dragging.dx} ${dragging.dy})` : undefined" text-anchor="middle"
        @dblclick.stop="editable && !connecting && emit('edit-name', label.id)" @pointerdown.stop="startLabel($event, label)" @keydown="labelKey($event, label)">
        <title>{{ editable ? 'Povucite za pomak oznake' : label.name }}</title>
        <tspan v-for="(line, i) in label.lines" :key="i" :x="label.box.x + label.box.width / 2" :dy="i ? 12 : 0">{{ line }}</tspan>
      </text>
    </g>
    <g class="alignment-guides" pointer-events="none" aria-hidden="true" stroke="#087caa" stroke-dasharray="5 4">
      <line v-if="dragging?.guideX != null" :x1="dragging.guideX" :x2="dragging.guideX" :y1="view.y" :y2="view.y + view.height" vector-effect="non-scaling-stroke" />
      <line v-if="dragging?.guideY != null" :y1="dragging.guideY" :y2="dragging.guideY" :x1="view.x" :x2="view.x + view.width" vector-effect="non-scaling-stroke" />
    </g>
    <polyline v-if="dragging?.creation" :points="flowPoints(dragging.points)" fill="none" stroke="#087caa" stroke-width="2" stroke-dasharray="5 3" pointer-events="none" />
    <g v-if="creationPorts.length" class="route-handles">
      <g v-for="port in creationPorts" :key="port.side" :transform="`translate(${port.x} ${port.y})`" tabindex="0" role="button"
        :aria-label="'Nova veza: ' + port.side" @pointerdown.stop="startFlow(port, $event)" @keydown.enter.stop.prevent="startFlow(port)" @keydown.space.stop.prevent="startFlow(port)">
        <title>Povucite do zadatka za novu vezu</title>
        <circle r="9" fill="transparent" /><circle r="4.5" />
      </g>
    </g>
    <g v-if="selectedFlow" class="route-handles" @keydown.delete.stop.prevent>
      <g v-for="h in handles" :key="h.i + ':' + !!h.segment" :transform="`translate(${h.x} ${h.y})`" tabindex="0" role="button" :aria-label="(h.segment ? 'Pomakni segment ' : 'Pomakni zavoj ') + (h.i + 1)" @pointerdown.stop="startHandle($event, h)" @keydown="nudge($event, h)" @keydown.delete.stop.prevent="deleteWaypoint($event, h)">
        <title>{{ h.segment ? 'Delete: ukloni susjedni zavoj' : 'Delete: ukloni zavoj' }}</title>
        <circle r="8" fill="transparent" />
        <rect v-if="h.segment" x="-3.5" y="-3.5" width="7" height="7" />
        <circle v-else r="4.5" />
      </g>
      <g v-for="port in gatewayPorts" :key="port.ref + port.side" :class="{ snapped: dragging?.snapPort?.ref === port.ref && dragging.snapPort.side === port.side }" :transform="`translate(${port.x} ${port.y})`" tabindex="0" role="button"
        :aria-label="`Spoji ${port.ref === 'sourceRef' ? 'početak' : 'kraj'} veze: ${port.side}`" @pointerdown.stop="startDock($event, port)" @keydown.enter.stop.prevent="commitRoute(selectedFlow, gatewayRoute(port, selectedFlow.waypoints))" @keydown.space.stop.prevent="commitRoute(selectedFlow, gatewayRoute(port, selectedFlow.waypoints))">
        <title>{{ 'Spoji vezu: ' + port.side }}</title>
        <circle r="9" fill="transparent" /><circle r="4.5" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.fipu-bpmn-canvas { width: 100%; height: 100%; min-height: 240px; display: block; touch-action: none; user-select: none; color: #172234; }
.fipu-bpmn-canvas { cursor: grab; }
.fipu-bpmn-canvas.panning { cursor: grabbing; }
.bpmn-node, .bpmn-flow { cursor: pointer; outline: none; }
.route-handles g { cursor: move; fill: white; }
.route-handles g > :last-child { stroke: #087caa; stroke-width: 2; }
.route-handles g.snapped > :last-child, .route-handles g:focus > :last-child { fill: #90d8f3; }
.bpmn-node.movable { cursor: move; }
.connecting .bpmn-node { cursor: crosshair; }
.node-shape { stroke: #536c82; stroke-width: 1.5; }
.node-shape.end-event { stroke-width: 3.5; }
.bpmn-node:hover .node-shape, .bpmn-node:focus .node-shape { stroke: #087caa; stroke-width: 2.5; }
.bpmn-node.selected .node-shape { stroke: #087caa; stroke-width: 2; }
.bpmn-node.selected .node-shape.end-event, .bpmn-node:hover .node-shape.end-event, .bpmn-node:focus .node-shape.end-event { stroke-width: 3.5; }
.selection-outline { fill: none; stroke: #1595bd; stroke-width: 1; stroke-dasharray: 4 3; }
.editable:not(.connecting) .external-labels text { cursor: move; }
.node-label, .flow-label, .pool-label, .lane-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #253d54; }
.node-label { font-size: 11px; }
.flow-label { font-size: 10px; paint-order: stroke; stroke: #fff; stroke-width: 4; stroke-linejoin: round; }
.pool-label { font-size: 13px; font-weight: 650; }
.lane-label { font-size: 12px; font-weight: 550; }
.bpmn-flow:focus .flow-line, .bpmn-flow:hover .flow-line { stroke: #087caa; stroke-width: 2.5; }
</style>
