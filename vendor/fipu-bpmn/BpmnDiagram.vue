<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { mdiAccountOutline, mdiCogOutline, mdiEmail, mdiHandBackLeftOutline } from '@mdi/js';

const taskIcons = { userTask: mdiAccountOutline, serviceTask: mdiCogOutline, sendTask: mdiEmail, manualTask: mdiHandBackLeftOutline };

const props = defineProps({
  model: { type: Object, required: true },
  selectedId: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  highlights: { type: Object, default: () => ({}) },
  connecting: { type: Boolean, default: false },
});
const emit = defineEmits(['select', 'move', 'background']);
const svg = ref(null);
const view = ref({ x: 0, y: 0, width: 1000, height: 700 });
const dragging = ref(null);
const markerId = `bpmn-arrow-${getCurrentInstance().uid}`;
const defaultFlows = computed(() => new Set(props.model.nodes.map(node => node.default).filter(Boolean)));
let observer;
const bounds = computed(() => {
  const shapes = [...props.model.nodes, ...props.model.lanes, ...props.model.pools];
  if (!shapes.length) return { x: 0, y: 0, width: 1000, height: 600 };
  const x = Math.min(...shapes.map(n => n.x)) - 45;
  const y = Math.min(...shapes.map(n => n.y)) - 55;
  return { x, y, width: Math.max(...shapes.map(n => n.x + n.width)) - x + 45, height: Math.max(...shapes.map(n => n.y + n.height)) - y + 70 };
});
function fit() {
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
  view.value = { x: center.x - (center.x - old.x) * actual, y: center.y - (center.y - old.y) * actual, width, height: old.height * actual };
}
function wheel(event) {
  if (event.ctrlKey || event.metaKey) zoom(event.deltaY > 0 ? 1.1 : 0.9, point(event));
  else { view.value.x += event.deltaX * view.value.width / svg.value.clientWidth; view.value.y += event.deltaY * view.value.height / svg.value.clientHeight; }
}
function begin(event, node) {
  if (event.button !== 0) return;
  const p = point(event);
  if (node) emit('select', node.id);
  if (props.connecting && node) return;
  if (node && !props.editable) return;
  dragging.value = { id: node?.id, start: p, x: node?.x, y: node?.y, dx: 0, dy: 0, clientX: event.clientX, clientY: event.clientY, view: { ...view.value } };
  svg.value.setPointerCapture(event.pointerId);
}
function move(event) {
  const drag = dragging.value;
  if (!drag) return;
  const dx = (event.clientX - drag.clientX) * drag.view.width / svg.value.clientWidth;
  const dy = (event.clientY - drag.clientY) * drag.view.height / svg.value.clientHeight;
  if (drag.id) { drag.dx = dx; drag.dy = dy; }
  else { view.value.x = drag.view.x - dx; view.value.y = drag.view.y - dy; }
}
function end(event) {
  const drag = dragging.value;
  if (!drag) return;
  dragging.value = null;
  if (svg.value.hasPointerCapture(event.pointerId)) svg.value.releasePointerCapture(event.pointerId);
  if (drag.id && (Math.abs(drag.dx) > 1 || Math.abs(drag.dy) > 1)) emit('move', { id: drag.id, x: Math.round(drag.x + drag.dx), y: Math.round(drag.y + drag.dy) });
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
function label(node) {
  return node.label || { x: node.x + node.width / 2 - 55, y: node.y + node.height + 8, width: 110, height: 40 };
}
function defaultMark(flow) {
  const [a, b] = flow.waypoints;
  if (!a || !b) return '';
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const dx = (b.x - a.x) / length, dy = (b.y - a.y) / length;
  const x = a.x + dx * 12, y = a.y + dy * 12;
  return `M${x - dx * 3 - dy * 5} ${y - dy * 3 + dx * 5}L${x + dx * 3 + dy * 5} ${y + dy * 3 - dx * 5}`;
}
function flowPoints(flow) { return flow.waypoints.map(p => `${p.x},${p.y}`).join(' '); }
function focus(id) {
  const node = props.model.nodes.find(n => n.id === id);
  if (!node) return;
  const width = Math.min(view.value.width, 850);
  const ratio = view.value.height / view.value.width;
  view.value = { x: node.x + node.width / 2 - width / 2, y: node.y + node.height / 2 - width * ratio / 2, width, height: width * ratio };
}
function center() { return { x: view.value.x + view.value.width / 2, y: view.value.y + view.value.height / 2 }; }
function key(event, node) {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); emit('select', node.id); }
  if (!props.editable || props.connecting) return;
  const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  if (moves[event.key]) { event.preventDefault(); const [x, y] = moves[event.key]; emit('move', { id: node.id, x: node.x + x * (event.shiftKey ? 1 : 10), y: node.y + y * (event.shiftKey ? 1 : 10) }); }
}
onMounted(() => { fit(); observer = new ResizeObserver(fit); observer.observe(svg.value); });
onBeforeUnmount(() => observer?.disconnect());
watch(() => props.model.processId, () => nextTick(fit));
defineExpose({ fit, focus, center, zoomIn: () => zoom(0.8), zoomOut: () => zoom(1.25) });
</script>

<template>
  <svg ref="svg" class="fipu-bpmn-canvas" :class="{ connecting, panning: dragging && !dragging.id }" :viewBox="`${view.x} ${view.y} ${view.width} ${view.height}`" role="group" aria-label="BPMN dijagram procesa. Povucite pozadinu za pomicanje; Control i kotačić za zumiranje." @wheel.prevent="wheel" @pointerdown.self="begin($event)" @pointermove="move" @pointerup="end" @pointercancel="dragging = null">
    <defs><marker :id="markerId" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 8 4 0 8Z" fill="#5f7185" /></marker></defs>
    <g class="bpmn-pools" @pointerdown="begin($event)">
      <g v-for="pool in model.pools" :key="pool.id"><rect :x="pool.x" :y="pool.y" :width="pool.width" :height="pool.height" fill="#fff" stroke="#9babbc" /><line :x1="pool.x + 30" :x2="pool.x + 30" :y1="pool.y" :y2="pool.y + pool.height" stroke="#9babbc" /><text :transform="`translate(${pool.x + 19} ${pool.y + pool.height / 2}) rotate(-90)`" text-anchor="middle" class="pool-label">{{ pool.name }}</text></g>
      <g v-for="(lane, index) in model.lanes" :key="lane.id"><rect :x="lane.x" :y="lane.y" :width="lane.width" :height="lane.height" :fill="index % 2 ? '#f7fafc' : '#fff'" stroke="#cbd5df" /><line :x1="lane.x + 30" :x2="lane.x + 30" :y1="lane.y" :y2="lane.y + lane.height" stroke="#cbd5df" /><text :transform="`translate(${lane.x + 19} ${lane.y + lane.height / 2}) rotate(-90)`" text-anchor="middle" class="lane-label">{{ lane.name }}</text></g>
    </g>
    <g v-for="flow in model.flows" :key="flow.id" class="bpmn-flow" :class="{ selected: selectedId === flow.id }" tabindex="0" role="button" :aria-label="`Sequence Flow: ${flow.name || flow.id}`" @pointerdown.stop="emit('select', flow.id)" @keydown.enter.prevent="emit('select', flow.id)" @keydown.space.prevent="emit('select', flow.id)">
      <title>{{ flow.name || flow.id }}{{ flow.condition ? ` · ${flow.condition}` : '' }}</title>
      <polyline :points="flowPoints(flow)" fill="none" stroke="transparent" stroke-width="14" />
      <polyline class="flow-line" :points="flowPoints(flow)" fill="none" :stroke="selectedId === flow.id ? '#087caa' : '#5f7185'" :stroke-width="selectedId === flow.id ? 2.5 : 1.4" :marker-end="`url(#${markerId})`" />
      <path v-if="defaultFlows.has(flow.id)" :d="defaultMark(flow)" stroke="#5f7185" stroke-width="1.6" />
      <text v-if="flow.name && flow.waypoints.length" class="flow-label" :x="flow.label ? flow.label.x + flow.label.width / 2 : flow.waypoints[Math.floor(flow.waypoints.length / 2)].x" :y="flow.label ? flow.label.y + 12 : flow.waypoints[Math.floor(flow.waypoints.length / 2)].y - 8" text-anchor="middle">{{ flow.name }}</text>
    </g>
    <g v-for="node in model.nodes" :key="node.id" class="bpmn-node" :class="{ selected: selectedId === node.id, movable: editable, active: !!highlights[node.id] }" :transform="position(node)" tabindex="0" role="button" :aria-label="`${node.type}: ${node.name || node.id}`" :aria-pressed="selectedId === node.id" @pointerdown.stop="begin($event, node)" @keydown="key($event, node)" @dblclick.stop="focus(node.id)">
      <title>{{ node.name || node.id }} · {{ node.type }}</title>
      <rect v-if="selectedId === node.id" x="-5" y="-5" :width="node.width + 10" :height="node.height + 10" rx="8" class="selection-outline" />
      <circle v-if="node.type.endsWith('Event')" class="node-shape" :class="{ 'end-event': node.type === 'endEvent' }" :cx="node.width / 2" :cy="node.height / 2" :r="Math.min(node.width, node.height) / 2 - 2" :fill="highlights[node.id] || '#fff'" :stroke-width="node.type === 'endEvent' ? 3.5 : 1.7" />
      <g v-else-if="node.type.endsWith('Gateway')">
        <polygon class="node-shape" :points="`${node.width / 2},0 ${node.width},${node.height / 2} ${node.width / 2},${node.height} 0,${node.height / 2}`" :fill="highlights[node.id] || '#fff'" />
        <path v-if="node.type === 'parallelGateway'" :d="`M${node.width / 2} ${node.height * .28}v${node.height * .44}M${node.width * .28} ${node.height / 2}h${node.width * .44}`" stroke="#253d54" stroke-width="3" />
        <path v-else :d="`M${node.width * .34} ${node.height * .30}l${node.width * .32} ${node.height * .4}M${node.width * .66} ${node.height * .30}l-${node.width * .32} ${node.height * .4}`" stroke="#253d54" stroke-width="3" />
      </g>
      <g v-else>
        <rect class="node-shape" x="0" y="0" :width="node.width" :height="node.height" rx="10" :fill="highlights[node.id] || '#fff'" />
        <path v-if="taskIcons[node.type]" :d="taskIcons[node.type]" transform="translate(8 7) scale(.75)" fill="#36536b" />
        <text class="node-label" :x="node.width / 2" :y="Math.max(31, node.height / 2 - (lines(node.name, node.width - 14).length - 1) * 6 + 7)" text-anchor="middle"><tspan v-for="(line, i) in lines(node.name, node.width - 14)" :key="i" :x="node.width / 2" :dy="i ? 12 : 0">{{ line }}</tspan></text>
      </g>
    </g>
    <g class="external-labels" pointer-events="none"><template v-for="node in model.nodes" :key="node.id"><text v-if="externalLabel(node) && node.name" class="node-label" :x="label(node).x + label(node).width / 2" :y="label(node).y + 11" text-anchor="middle"><tspan v-for="(line, i) in lines(node.name, label(node).width)" :key="i" :x="label(node).x + label(node).width / 2" :dy="i ? 12 : 0">{{ line }}</tspan></text></template></g>
  </svg>
</template>

<style scoped>
.fipu-bpmn-canvas { width: 100%; height: 100%; min-height: 240px; display: block; touch-action: none; user-select: none; color: #172234; cursor: grab; }
.fipu-bpmn-canvas.panning { cursor: grabbing; }
.bpmn-node, .bpmn-flow { cursor: pointer; outline: none; }
.bpmn-node.movable { cursor: move; }
.connecting .bpmn-node { cursor: crosshair; }
.node-shape { stroke: #536c82; stroke-width: 1.5; }
.node-shape.end-event { stroke-width: 3.5; }
.bpmn-node:hover .node-shape, .bpmn-node:focus .node-shape { stroke: #087caa; stroke-width: 2.5; }
.bpmn-node.selected .node-shape { stroke: #087caa; stroke-width: 2; }
.bpmn-node.selected .node-shape.end-event, .bpmn-node:hover .node-shape.end-event, .bpmn-node:focus .node-shape.end-event { stroke-width: 3.5; }
.selection-outline { fill: none; stroke: #1595bd; stroke-width: 1; stroke-dasharray: 4 3; }
.node-label, .flow-label, .pool-label, .lane-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #253d54; }
.node-label { font-size: 11px; }
.flow-label { font-size: 10px; paint-order: stroke; stroke: #fff; stroke-width: 4; stroke-linejoin: round; }
.pool-label { font-size: 13px; font-weight: 650; }
.lane-label { font-size: 12px; font-weight: 550; }
.bpmn-flow:focus .flow-line, .bpmn-flow:hover .flow-line { stroke: #087caa; stroke-width: 2.5; }
</style>
