export const NS = Object.freeze({
  bpmn: 'http://www.omg.org/spec/BPMN/20100524/MODEL',
  bpmndi: 'http://www.omg.org/spec/BPMN/20100524/DI',
  dc: 'http://www.omg.org/spec/DD/20100524/DC',
  di: 'http://www.omg.org/spec/DD/20100524/DI',
  fipu: 'urn:fipu:bpmn:1',
  xsi: 'http://www.w3.org/2001/XMLSchema-instance',
});
const LEGACY = 'http://camunda.org/schema/1.0/bpmn';
const XMLNS = 'http://www.w3.org/2000/xmlns/';
export const NODE_TYPES = Object.freeze(['startEvent', 'endEvent', 'intermediateCatchEvent', 'intermediateThrowEvent', 'userTask', 'serviceTask', 'sendTask', 'manualTask', 'task', 'exclusiveGateway', 'parallelGateway']);
export const TYPE_LABELS = Object.freeze({ startEvent: 'Start Event', endEvent: 'End Event', intermediateCatchEvent: 'Message Catch Event', timerCatch: 'Timer Catch Event', intermediateThrowEvent: 'None Throw Event', userTask: 'User Task', serviceTask: 'Service Task', sendTask: 'Send Task', manualTask: 'Manual Task', task: 'Task', exclusiveGateway: 'Exclusive Gateway', parallelGateway: 'Parallel Gateway', sequenceFlow: 'Sequence Flow', messageFlow: 'Message Flow', lane: 'Lane', participant: 'Pool' });
const BPMN_ELEMENTS = new Set(['definitions', 'collaboration', 'messageFlow', 'participant', 'process', 'laneSet', 'lane', 'flowNodeRef', 'extensionElements', 'documentation', 'sequenceFlow', 'incoming', 'outgoing', 'conditionExpression', 'timerEventDefinition', 'timeDuration', 'messageEventDefinition', 'terminateEventDefinition', ...NODE_TYPES]);
const EXT_ELEMENTS = new Set(['connector', 'connectorId', 'inputOutput', 'inputParameter', 'outputParameter', 'map', 'entry', 'list', 'value', 'formData', 'formField', 'properties', 'property', 'validation', 'constraint']);
const EXT_ATTRIBUTES = { inputParameter: ['name'], outputParameter: ['name'], entry: ['key'], formField: ['id', 'type', 'label', 'defaultValue'], property: ['id', 'name', 'value'], constraint: ['name', 'config'] };
const EXT_CHILDREN = { connector: ['connectorId', 'inputOutput'], inputOutput: ['inputParameter', 'outputParameter'], inputParameter: ['list', 'map'], outputParameter: ['list', 'map'], list: ['value'], map: ['entry'], formData: ['formField'], formField: ['properties', 'validation'], properties: ['property'], validation: ['constraint'] };
const all = (element, namespace, name) => Array.from(element.getElementsByTagNameNS(namespace, name));
const children = (element, namespace, name) => Array.from(element?.children || []).filter(child => child.namespaceURI === namespace && child.localName === name);
const child = (element, namespace, name) => children(element, namespace, name)[0];
const attr = (element, name) => element?.getAttribute(name) || '';
const text = (element, namespace, name) => child(element, namespace, name)?.textContent || '';

function create(document, prefix, name, attributes = {}, content) {
  const element = document.createElementNS(NS[prefix], `${prefix}:${name}`);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  if (content !== undefined) element.textContent = String(content);
  return element;
}

function setExporter(document) {
  const root = document.documentElement;
  for (const [prefix, namespace] of Object.entries(NS)) root.setAttributeNS(XMLNS, `xmlns:${prefix}`, namespace);
  root.setAttribute('targetNamespace', 'urn:fipu:praksa');
  root.setAttribute('exporter', 'Praksa BPMN Studio');
  root.setAttribute('exporterVersion', '0.1.0');
}

function readValue(element) {
  const list = child(element, NS.fipu, 'list');
  const map = child(element, NS.fipu, 'map');
  if (list) return Array.from(list.children).map(value => value.textContent || '');
  if (map) return Object.fromEntries(children(map, NS.fipu, 'entry').map(entry => [attr(entry, 'key'), entry.textContent || '']));
  return element.textContent || '';
}

function readParameters(element, direction) {
  return Object.fromEntries(children(child(element, NS.fipu, 'inputOutput'), NS.fipu, `${direction}Parameter`).map(parameter => [attr(parameter, 'name'), readValue(parameter)]));
}

function bounds(element) {
  if (!element) return null;
  return Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, Number(element.getAttribute(key))]));
}

function readModel(document) {
  const process = all(document, NS.bpmn, 'process')[0];
  const shapes = new Map(all(document, NS.bpmndi, 'BPMNShape').map(shape => [attr(shape, 'bpmnElement'), shape]));
  const edges = new Map(all(document, NS.bpmndi, 'BPMNEdge').map(edge => [attr(edge, 'bpmnElement'), edge]));
  const geometry = element => {
    const shape = shapes.get(attr(element, 'id'));
    return { ...(bounds(child(shape, NS.dc, 'Bounds')) || { x: 0, y: 0, width: 100, height: 80 }), label: bounds(child(child(shape, NS.bpmndi, 'BPMNLabel'), NS.dc, 'Bounds')) };
  };
  const basic = element => ({ id: attr(element, 'id'), type: element.localName, name: attr(element, 'name') });
  const lanes = all(document, NS.bpmn, 'lane').map(lane => ({ ...basic(lane), ...geometry(lane) }));
  const laneIds = new Map(all(document, NS.bpmn, 'lane').flatMap(lane => children(lane, NS.bpmn, 'flowNodeRef').map(ref => [ref.textContent.trim(), attr(lane, 'id')])));
  const nodes = Array.from(process?.children || []).filter(element => NODE_TYPES.includes(element.localName) && element.namespaceURI === NS.bpmn).map(element => {
    const extension = child(element, NS.bpmn, 'extensionElements');
    const connector = child(extension, NS.fipu, 'connector');
    const config = readParameters(connector, 'input');
    return {
      ...basic(element), ...geometry(element), laneId: laneIds.get(attr(element, 'id')) || '',
      documentation: text(element, NS.bpmn, 'documentation'),
      default: attr(element, 'default'),
      timerDuration: child(element, NS.bpmn, 'timerEventDefinition') ? text(child(element, NS.bpmn, 'timerEventDefinition'), NS.bpmn, 'timeDuration').trim() : null,
      terminate: !!child(element, NS.bpmn, 'terminateEventDefinition'),
      outcome: element.getAttributeNS(NS.fipu, 'outcome') || 'finished',
      inputs: readParameters(extension, 'input'), outputs: readParameters(extension, 'output'),
      connector: connector ? { id: text(connector, NS.fipu, 'connectorId'), method: config.method || '', url: config.url || '', parameters: config.url_parameter || {} } : null,
      formFields: children(child(extension, NS.fipu, 'formData'), NS.fipu, 'formField').map(field => ({
        ...Object.fromEntries(Array.from(field.attributes).map(attribute => [attribute.name, attribute.value])),
        label: attr(field, 'label'),
        properties: Object.fromEntries(all(field, NS.fipu, 'property').map(property => [attr(property, 'id'), attr(property, 'value')])),
        validation: Object.fromEntries(all(field, NS.fipu, 'constraint').map(constraint => [attr(constraint, 'name'), attr(constraint, 'config')])),
      })),
    };
  });
  const readFlows = type => all(document, NS.bpmn, type).map(element => {
    const edge = edges.get(attr(element, 'id'));
    return { ...basic(element), documentation: text(element, NS.bpmn, 'documentation'), sourceRef: attr(element, 'sourceRef'), targetRef: attr(element, 'targetRef'), condition: text(element, NS.bpmn, 'conditionExpression'), waypoints: children(edge, NS.di, 'waypoint').map(point => ({ x: Number(attr(point, 'x')), y: Number(attr(point, 'y')) })), label: bounds(child(child(edge, NS.bpmndi, 'BPMNLabel'), NS.dc, 'Bounds')) };
  });
  return { document, processId: attr(process, 'id'), name: attr(process, 'name'), nodes, flows: readFlows('sequenceFlow'), messageFlows: readFlows('messageFlow'), lanes, pools: all(document, NS.bpmn, 'participant').map(element => ({ ...basic(element), ...geometry(element) })) };
}

export function parseModel(xml) {
  if (typeof xml !== 'string' || !xml.trim()) throw new Error('Choose a BPMN XML file.');
  if (xml.length > 2_000_000) throw new Error('BPMN files must be smaller than 2 MB.');
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('DOCTYPE and entity declarations are not supported.');
  const document = new DOMParser().parseFromString(xml, 'application/xml');
  if (document.getElementsByTagName('parsererror').length || document.documentElement.localName === 'parsererror') throw new Error('The file is not valid XML.');
  if (document.documentElement.namespaceURI !== NS.bpmn || document.documentElement.localName !== 'definitions') throw new Error('Expected BPMN 2.0 definitions.');
  if (all(document, '*', '*').some(element => element.namespaceURI === LEGACY ||
      Array.from(element.attributes).some(attribute => attribute.namespaceURI === LEGACY))) {
    throw new Error('Unsupported Camunda execution extension.');
  }
  setExporter(document);
  return readModel(document);
}

export function serializeModel(model) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(model.document.documentElement)}\n`;
}

function elementById(model, id) {
  const element = all(model.document, NS.bpmn, '*').find(candidate => attr(candidate, 'id') === id);
  if (!element) throw new Error(`BPMN element ${id} was not found.`);
  return element;
}

function ensureChild(parent, prefix, name) {
  let element = child(parent, NS[prefix], name);
  if (!element) {
    element = create(parent.ownerDocument, prefix, name);
    // BPMN documentation and extensions precede incoming/outgoing references.
    if (prefix === 'bpmn' && ['documentation', 'extensionElements'].includes(name)) {
      const before = Array.from(parent.children).find(item => item.localName !== 'documentation' && (name === 'documentation' || item.localName !== 'extensionElements'));
      parent.insertBefore(element, before || null);
    } else parent.append(element);
  }
  return element;
}

function setParameters(parent, direction, values) {
  if (!values || Array.isArray(values) || typeof values !== 'object') throw new Error('Parameters must be a JSON object.');
  const io = ensureChild(parent, 'fipu', 'inputOutput');
  for (const old of children(io, NS.fipu, `${direction}Parameter`)) old.remove();
  for (const [name, value] of Object.entries(values)) {
    if (!name.trim()) throw new Error('Parameter names cannot be empty.');
    const parameter = create(parent.ownerDocument, 'fipu', `${direction}Parameter`, { name });
    if (Array.isArray(value)) {
      const list = create(parent.ownerDocument, 'fipu', 'list');
      for (const item of value) { if (typeof item !== 'string') throw new Error('List parameter values must be strings.'); list.append(create(parent.ownerDocument, 'fipu', 'value', {}, item)); }
      parameter.append(list);
    } else if (value && typeof value === 'object') {
      const map = create(parent.ownerDocument, 'fipu', 'map');
      for (const [key, item] of Object.entries(value)) { if (typeof item !== 'string') throw new Error('Map parameter values must be strings.'); map.append(create(parent.ownerDocument, 'fipu', 'entry', { key }, item)); }
      parameter.append(map);
    } else if (typeof value === 'string') parameter.textContent = value;
    else throw new Error('Parameter values must be strings, string lists, or string maps.');
    io.append(parameter);
  }
}

function setLane(model, element, laneId) {
  if (laneId && !model.lanes.some(lane => lane.id === laneId)) throw new Error('Choose an existing Lane.');
  for (const reference of all(model.document, NS.bpmn, 'flowNodeRef')) if (reference.textContent.trim() === attr(element, 'id')) reference.remove();
  if (laneId) elementById(model, laneId).append(create(model.document, 'bpmn', 'flowNodeRef', {}, attr(element, 'id')));
}

export function variantsFor(type) {
  if (/task$/i.test(type)) return NODE_TYPES.filter(t => /task$/i.test(t));
  if (type.endsWith('Event')) return ['startEvent', 'intermediateCatchEvent', 'timerCatch', 'intermediateThrowEvent', 'endEvent'];
  return [];
}

function replaceVariant(element, variant) {
  if (!variantsFor(element.localName).includes(variant)) throw new Error('Unsupported variant for this element.');
  const type = variant === 'timerCatch' ? 'intermediateCatchEvent' : variant;
  if (element.localName !== type) {
    const replacement = create(element.ownerDocument, 'bpmn', type);
    for (const attr of Array.from(element.attributes)) replacement.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
    while (element.firstChild) replacement.append(element.firstChild);
    element.replaceWith(replacement);
    element = replacement;
  }
  if (type.endsWith('Event')) {
    element.removeAttributeNS(NS.fipu, 'outcome');
    for (const name of ['messageEventDefinition', 'timerEventDefinition', 'terminateEventDefinition']) child(element, NS.bpmn, name)?.remove();
    if (variant === 'timerCatch') ensureChild(ensureChild(element, 'bpmn', 'timerEventDefinition'), 'bpmn', 'timeDuration').textContent = 'PT15M';
    if (variant === 'intermediateCatchEvent') ensureChild(element, 'bpmn', 'messageEventDefinition');
  } else {
    const ext = child(element, NS.bpmn, 'extensionElements');
    if (!['serviceTask', 'sendTask'].includes(type)) child(ext, NS.fipu, 'connector')?.remove();
    if (type !== 'userTask') child(ext, NS.fipu, 'formData')?.remove();
    if (['task', 'manualTask'].includes(type)) child(ext, NS.fipu, 'inputOutput')?.remove();
  }
  return element;
}

export function updateElement(model, id, patch) {
  // Work on a clone so a rejected edit cannot partially destroy the current draft.
  const next = readModel(model.document.cloneNode(true));
  let element = elementById(next, id);
  const currentVariant = child(element, NS.bpmn, 'timerEventDefinition') ? 'timerCatch' : element.localName;
  if ('variant' in patch && patch.variant !== currentVariant) element = replaceVariant(element, patch.variant);
  if ('timerDuration' in patch) {
    const timer = child(element, NS.bpmn, 'timerEventDefinition');
    if (!timer || !validDuration(patch.timerDuration)) throw new Error('Upišite trajanje, primjerice PT15M, PT30S ili P1D.');
    ensureChild(timer, 'bpmn', 'timeDuration').textContent = patch.timerDuration;
  }
  if ('id' in patch && patch.id !== id) throw new Error('Existing IDs are workflow contracts and cannot be renamed.');
  if ('name' in patch) element.setAttribute('name', patch.name);
  if ('documentation' in patch) ensureChild(element, 'bpmn', 'documentation').textContent = patch.documentation;
  if ('terminate' in patch || 'outcome' in patch) {
    if (element.localName !== 'endEvent') throw new Error('Termination and outcomes belong to End Events.');
    if ('terminate' in patch) {
      if (typeof patch.terminate !== 'boolean') throw new Error('terminate must be a boolean.');
      if (patch.terminate) ensureChild(element, 'bpmn', 'terminateEventDefinition');
      else child(element, NS.bpmn, 'terminateEventDefinition')?.remove();
    }
    if ('outcome' in patch) {
      if (!['finished', 'cancelled'].includes(patch.outcome)) throw new Error('Unsupported end outcome.');
      if (patch.outcome === 'finished') element.removeAttributeNS(NS.fipu, 'outcome');
      else element.setAttributeNS(NS.fipu, 'fipu:outcome', patch.outcome);
    }
  }
  if ('default' in patch) {
    if (element.localName !== 'exclusiveGateway') throw new Error('Default flows belong to Exclusive Gateways.');
    const flow = next.flows.find(item => item.id === patch.default && item.sourceRef === id);
    if (patch.default && (!flow || flow.condition)) throw new Error('Choose an outgoing Sequence Flow with no condition as the default.');
    if (patch.default) element.setAttribute('default', patch.default); else element.removeAttribute('default');
  }
  if ('condition' in patch) {
    if (element.localName !== 'sequenceFlow') throw new Error('Conditions belong to Sequence Flows.');
    if (patch.condition) {
      const condition = ensureChild(element, 'bpmn', 'conditionExpression');
      condition.setAttributeNS(NS.xsi, 'xsi:type', 'bpmn:tFormalExpression');
      condition.textContent = patch.condition;
    } else child(element, NS.bpmn, 'conditionExpression')?.remove();
  }
  if ('laneId' in patch) setLane(next, element, patch.laneId);
  if (['inputs', 'outputs', 'connector', 'formFields'].some(key => key in patch)) {
    const extension = ensureChild(element, 'bpmn', 'extensionElements');
    if ('inputs' in patch) setParameters(extension, 'input', patch.inputs);
    if ('outputs' in patch) setParameters(extension, 'output', patch.outputs);
    if ('connector' in patch) {
      if (!['serviceTask', 'sendTask'].includes(element.localName)) throw new Error('Connectors belong to Service Tasks and Send Tasks.');
      if (patch.connector === null) child(extension, NS.fipu, 'connector')?.remove();
      else {
        const connector = ensureChild(extension, 'fipu', 'connector');
        ensureChild(connector, 'fipu', 'connectorId').textContent = patch.connector.id;
        const parameters = { ...readParameters(connector, 'input'), method: patch.connector.method, url: patch.connector.url, url_parameter: patch.connector.parameters || {} };
        setParameters(connector, 'input', parameters);
      }
    }
    if ('formFields' in patch) {
      if (element.localName !== 'userTask' || !Array.isArray(patch.formFields)) throw new Error('Form fields belong to User Tasks and must be an array.');
      const form = create(next.document, 'fipu', 'formData');
      for (const field of patch.formFields) {
        const { properties = {}, validation = {}, ...attributes } = field;
        if (Object.values(attributes).some(value => typeof value !== 'string') || [properties, validation].some(value => !value || Array.isArray(value) || typeof value !== 'object' || Object.values(value).some(item => typeof item !== 'string'))) throw new Error('Form field attributes, properties, and validation values must be strings.');
        const item = create(next.document, 'fipu', 'formField', attributes);
        if (Object.keys(properties).length) {
          const container = create(next.document, 'fipu', 'properties');
          for (const [key, value] of Object.entries(properties)) container.append(create(next.document, 'fipu', 'property', { id: key, value }));
          item.append(container);
        }
        if (Object.keys(validation).length) {
          const container = create(next.document, 'fipu', 'validation');
          for (const [name, config] of Object.entries(validation)) container.append(create(next.document, 'fipu', 'constraint', { name, config }));
          item.append(container);
        }
        form.append(item);
      }
      const previous = child(extension, NS.fipu, 'formData');
      if (previous) previous.replaceWith(form); else extension.append(form);
    }
  }
  return readModel(next.document);
}

function diagramElement(model, type, id) {
  return all(model.document, NS.bpmndi, type).find(element => attr(element, 'bpmnElement') === id);
}

function route(source, target) {
  const leftToRight = source.x <= target.x;
  const a = { x: source.x + (leftToRight ? source.width : 0), y: source.y + source.height / 2 };
  const b = { x: target.x + (leftToRight ? 0 : target.width), y: target.y + target.height / 2 };
  const fromGateway = source.type.endsWith('Gateway'), toGateway = target.type.endsWith('Gateway');
  if ((fromGateway || toGateway) && (source.y + source.height <= target.y || target.y + target.height <= source.y)) {
    const down = source.y < target.y;
    const start = { x: source.x + source.width / 2, y: source.y + (down ? source.height : 0) };
    const end = { x: target.x + target.width / 2, y: target.y + (down ? 0 : target.height) };
    if (source.x + source.width <= target.x || target.x + target.width <= source.x) {
      return fromGateway ? [start, { x: start.x, y: b.y }, b] : [a, { x: end.x, y: a.y }, end];
    }
    if (start.x === end.x) return [start, end];
    const y = (start.y + end.y) / 2;
    return [start, { x: start.x, y }, { x: end.x, y }, end];
  }
  if (a.y === b.y) return [a, b];
  const middle = (a.x + b.x) / 2;
  return [a, { x: middle, y: a.y }, { x: middle, y: b.y }, b];
}

export function portsForGateway(node, ref) {
  return [['gore', 0, -1], ['desno', 1, 0], ['dolje', 0, 1], ['lijevo', -1, 0]].map(([side, dx, dy]) => ({
      ref, side, dx, dy, node, x: node.x + node.width * (1 + dx) / 2, y: node.y + node.height * (1 + dy) / 2,
    }));
}

export function gatewayRoute(port, waypoints) {
  const incoming = port.ref === 'targetRef';
  const points = [...waypoints];
  if (incoming) points.reverse();
  const tip = { x: port.x, y: port.y };
  if (points.length < 2 || (tip.x === points[0].x && tip.y === points[0].y)) return waypoints;
  // Replace bends inside the gateway margin and keep the route beyond its first exit.
  const { x, y, width, height } = port.node;
  const left = x - 12, right = x + width + 12, top = y - 12, bottom = y + height + 12;
  const outside = points.findIndex((p, i) => i > 0 && (p.x < left || p.x > right || p.y < top || p.y > bottom));
  const lead = { x: tip.x + port.dx * 12, y: tip.y + port.dy * 12 };
  const path = [tip, lead];
  if (outside < 0) {
    path.push(points.at(-1));
  } else {
    const a = points[outside - 1], b = points[outside];
    const dx = b.x - a.x, dy = b.y - a.y;
    const tx = dx ? ((dx > 0 ? right : left) - a.x) / dx : Infinity;
    const ty = dy ? ((dy > 0 ? bottom : top) - a.y) / dy : Infinity;
    const exitSide = tx < ty ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
    const t = Math.min(tx, ty);
    const exit = { x: a.x + dx * t, y: a.y + dy * t };
    const startSide = port.dy < 0 ? 0 : port.dx > 0 ? 1 : port.dy > 0 ? 2 : 3;
    const corners = [{ x: right, y: top }, { x: right, y: bottom }, { x: left, y: bottom }, { x: left, y: top }];
    const clockwise = (exitSide - startSide + 4) % 4;
    const forward = clockwise === 1 || (clockwise === 2 && (port.dx ? port.dx * (exit.y - tip.y) : -port.dy * (exit.x - tip.x)) >= 0);
    for (let side = startSide; side !== exitSide;) {
      const previous = (side + 3) % 4;
      path.push(corners[forward ? side : previous]);
      side = forward ? (side + 1) % 4 : previous;
    }
    path.push(exit, ...points.slice(outside));
  }
  const route = path.filter((p, i) => !i || p.x !== path[i-1].x || p.y !== path[i-1].y);
  return incoming ? route.reverse() : route;
}
export function newFlowRoute(source, target, sourceSide) {
  const points = route(source, target);
  if (!sourceSide) return points;
  const port = portsForGateway(source, 'sourceRef').find(p => p.side === sourceSide);
  if (!source.type.endsWith('Gateway') || !port) throw new Error('Invalid gateway tip.');
  return gatewayRoute(port, points);
}

function writeWaypoints(edge, points) {
  for (const old of children(edge, NS.di, 'waypoint')) old.remove();
  const label = child(edge, NS.bpmndi, 'BPMNLabel');
  for (const point of points) edge.insertBefore(create(edge.ownerDocument, 'di', 'waypoint', point), label || null);
}

export function moveLabel(model, id, bounds) {
  if (!['x', 'y', 'width', 'height'].every(key => Number.isFinite(bounds[key])) || bounds.width < 0 || bounds.height < 0) throw new Error('Invalid label bounds.');
  const document = model.document.cloneNode(true);
  const isFlow = [...model.flows, ...model.messageFlows].some(flow => flow.id === id);
  if (!isFlow && !model.nodes.some(node => node.id === id && /(?:Event|Gateway)$/.test(node.type))) throw new Error('Only external labels can be moved.');
  const owner = diagramElement({ document }, isFlow ? 'BPMNEdge' : 'BPMNShape', id);
  if (!owner) throw new Error('Missing diagram element for label.');
  const box = ensureChild(ensureChild(owner, 'bpmndi', 'BPMNLabel'), 'dc', 'Bounds');
  for (const key of ['x', 'y', 'width', 'height']) box.setAttribute(key, bounds[key]);
  return readModel(document);
}

export function reshapeFlow(model, id, points) {
  const flow = [...model.flows, ...model.messageFlows].find(item => item.id === id);
  if (!flow || points.length < 2 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) throw new Error('Invalid flow route.');
  const document = model.document.cloneNode(true);
  const edge = diagramElement({ document }, 'BPMNEdge', id);
  if (!edge) throw new Error('Missing flow diagram edge.');
  writeWaypoints(edge, points);
  return readModel(document);
}

export function attachedWaypoints(flow, original, node) {
  const old = flow.waypoints;
  const points = old.map(point => ({ ...point }));
  if (points.length < 2) return points;
  for (const [ref, index, neighbor] of [[flow.sourceRef, 0, 1], [flow.targetRef, points.length - 1, points.length - 2]]) {
    if (ref !== node.id) continue;
    for (const [axis, size] of [['x', 'width'], ['y', 'height']]) {
      const offset = old[index][axis] - original[axis];
      points[index][axis] = node[axis] + offset + offset * (node[size] - original[size]) / (original[size] || 1);
      if (points.length > 2 && old[index][axis] === old[neighbor][axis]) points[neighbor][axis] = points[index][axis];
    }
  }
  // Keep the original docking sides when a straight horizontal or vertical route needs two bends.
  if (points.length === 2 && points[0].x !== points[1].x && points[0].y !== points[1].y) {
    const axis = old[0].x === old[1].x ? 'y' : old[0].y === old[1].y ? 'x' : null;
    if (axis) {
      const middle = (points[0][axis] + points[1][axis]) / 2;
      return [points[0], { ...points[0], [axis]: middle }, { ...points[1], [axis]: middle }, points[1]];
    }
  }
  return points;
}

export function moveElement(model, id, x, y, size) {
  if (![x, y].every(Number.isFinite)) throw new Error('Position must use finite coordinates.');
  const original = model.nodes.find(node => node.id === id);
  if (!original) throw new Error('Only flow nodes can be moved.');
  if (size && (!/task$/i.test(original.type) || ![size.width, size.height].every(n => Number.isFinite(n) && n > 0))) throw new Error('Only tasks can be resized to positive dimensions.');
  const next = readModel(model.document.cloneNode(true));
  const shape = diagramElement(next, 'BPMNShape', id);
  const box = child(shape, NS.dc, 'Bounds');
  if (!box) throw new Error('The node has no BPMN diagram bounds.');
  box.setAttribute('x', x); box.setAttribute('y', y);
  const label = child(child(shape, NS.bpmndi, 'BPMNLabel'), NS.dc, 'Bounds');
  if (label) { label.setAttribute('x', Number(attr(label, 'x')) + x - original.x); label.setAttribute('y', Number(attr(label, 'y')) + y - original.y); }
  const node = next.nodes.find(item => item.id === id);
  node.x = x; node.y = y;
  if (size) for (const axis of ['width', 'height']) {
    node[axis] = size[axis];
    box.setAttribute(axis, size[axis]);
  }
  for (const flow of [...next.flows, ...next.messageFlows].filter(item => item.sourceRef === id || item.targetRef === id)) {
    writeWaypoints(diagramElement(next, 'BPMNEdge', flow.id), attachedWaypoints(flow, original, node));
  }
  const lane = next.lanes.find(item => x + node.width / 2 >= item.x && x + node.width / 2 <= item.x + item.width && y + node.height / 2 >= item.y && y + node.height / 2 <= item.y + item.height);
  if (lane) setLane(next, elementById(next, id), lane.id);
  return readModel(next.document);
}

function nextId(model, prefix, requested) {
  const ids = new Set(all(model.document, '*', '*').map(element => attr(element, 'id')));
  if (requested !== undefined) {
    if (typeof requested !== 'string' || !/^[A-Za-z_][\w.-]*$/.test(requested) || ids.has(requested) || ids.has(`${requested}_di`)) throw new Error('Choose a unique XML ID using letters, digits, underscores, periods, or hyphens.');
    return requested;
  }
  let index = 1;
  while (ids.has(`${prefix}_${index}`) || ids.has(`${prefix}_${index}_di`)) index++;
  return `${prefix}_${index}`;
}

function plane(model) {
  const element = all(model.document, NS.bpmndi, 'BPMNPlane')[0];
  if (!element) throw new Error('The model has no BPMN diagram plane.');
  return element;
}

function validDuration(value) { return /^P(?:[1-9][0-9]{0,6}D|T[1-9][0-9]{0,6}[HMS])$/.test(value); }

export function addNode(model, type, options = {}) {
  if (!NODE_TYPES.includes(type)) throw new Error('This BPMN element is not supported by the Praksa engine.');
  const next = readModel(model.document.cloneNode(true));
  const id = nextId(next, type, options.id);
  const { x = 100, y = 100, name = TYPE_LABELS[type], laneId = '' } = options;
  if (![x, y].every(Number.isFinite)) throw new Error('Position must use finite coordinates.');
  const element = create(next.document, 'bpmn', type, { id, name });
  elementById(next, next.processId).append(element);
  if (type === 'intermediateCatchEvent' && options.timerDuration !== undefined) {
    if (!validDuration(options.timerDuration)) throw new Error('Invalid timer duration.');
    const timer = ensureChild(element, 'bpmn', 'timerEventDefinition');
    ensureChild(timer, 'bpmn', 'timeDuration').textContent = options.timerDuration;
  } else if (type === 'intermediateCatchEvent') element.append(create(next.document, 'bpmn', 'messageEventDefinition'));
  setLane(next, element, laneId);
  const shape = create(next.document, 'bpmndi', 'BPMNShape', { id: `${id}_di`, bpmnElement: id });
  const size = type.endsWith('Event') ? [36, 36] : type.endsWith('Gateway') ? [50, 50] : [120, 80];
  shape.append(create(next.document, 'dc', 'Bounds', { x, y, width: size[0], height: size[1] }));
  plane(next).append(shape);
  return readModel(next.document);
}

export function addFlow(model, sourceId, targetId, options = {}) {
  const source = model.nodes.find(node => node.id === sourceId);
  const target = model.nodes.find(node => node.id === targetId);
  if (!source || !target || sourceId === targetId || source.type === 'endEvent' || target.type === 'startEvent') throw new Error('Choose distinct flow nodes; End Events cannot have outgoing flows and Start Events cannot have incoming flows.');
  if (model.flows.some(flow => flow.sourceRef === sourceId && flow.targetRef === targetId)) throw new Error('These nodes already have a Sequence Flow.');
  const next = readModel(model.document.cloneNode(true));
  const id = nextId(next, 'Flow', options.id);
  const flow = create(next.document, 'bpmn', 'sequenceFlow', { id, sourceRef: sourceId, targetRef: targetId, name: options.name || '' });
  elementById(next, next.processId).append(flow);
  elementById(next, sourceId).append(create(next.document, 'bpmn', 'outgoing', {}, id));
  const targetElement = elementById(next, targetId);
  targetElement.insertBefore(create(next.document, 'bpmn', 'incoming', {}, id), child(targetElement, NS.bpmn, 'outgoing') || null);
  const edge = create(next.document, 'bpmndi', 'BPMNEdge', { id: `${id}_di`, bpmnElement: id });
  writeWaypoints(edge, newFlowRoute(source, target, options.sourceSide));
  plane(next).append(edge);
  return options.condition ? updateElement(readModel(next.document), id, { condition: options.condition }) : readModel(next.document);
}

export function removeElement(model, id) {
  const element = elementById(model, id);
  if (!NODE_TYPES.includes(element.localName) && !['sequenceFlow', 'messageFlow'].includes(element.localName)) throw new Error('Only nodes and flows can be removed.');
  const next = readModel(model.document.cloneNode(true));
  const ids = new Set([id, ...[...next.flows, ...next.messageFlows].filter(flow => flow.sourceRef === id || flow.targetRef === id).map(flow => flow.id)]);
  for (const candidate of all(next.document, '*', '*')) {
    if (ids.has(attr(candidate, 'id')) || ids.has(attr(candidate, 'bpmnElement')) || (candidate.namespaceURI === NS.bpmn && ['incoming', 'outgoing', 'flowNodeRef'].includes(candidate.localName) && ids.has(candidate.textContent.trim()))) candidate.remove();
    if (ids.has(attr(candidate, 'default'))) candidate.removeAttribute('default');
  }
  return readModel(next.document);
}

const eventParents = {
  timerEventDefinition: 'intermediateCatchEvent', messageEventDefinition: 'intermediateCatchEvent',
  terminateEventDefinition: 'endEvent', timeDuration: 'timerEventDefinition',
};

export function validateModel(model, connectors) {
  const issues = [];
  const report = (message, id = '', severity = 'error') => issues.push({ severity, id, message });
  const document = model.document;
  if (all(document, NS.bpmn, 'process').length !== 1) report('Exactly one executable Process is supported.');
  if (!model.processId) report('The Process requires an ID.');
  const ids = new Set();
  for (const element of all(document, '*', '*')) {
    const id = attr(element, 'id');
    if ([NS.bpmn, NS.bpmndi].includes(element.namespaceURI) && id) {
      if (ids.has(id)) report(`Duplicate BPMN ID: ${id}.`, id);
      ids.add(id);
    }
    if (element.namespaceURI === NS.bpmn && !BPMN_ELEMENTS.has(element.localName)) report(`Unsupported BPMN element: ${element.localName}. It is preserved but cannot be exported for execution.`, id);
    if (Object.hasOwn(eventParents, element.localName)) {
      const parent = element.parentElement;
      const owner = attr(parent?.closest('[id]'), 'id');
      if (element.namespaceURI !== NS.bpmn || parent?.namespaceURI !== NS.bpmn || parent.localName !== eventParents[element.localName]) report(`Invalid namespace or parent for ${element.localName}.`, owner);
      if (element.localName !== 'timerEventDefinition' && element.children.length) report(`${element.localName} cannot contain nested elements.`, owner);
      if (element.localName === 'messageEventDefinition' && element.hasAttribute('messageRef')) report('Message delivery uses the instance and event ID; messageRef correlation is unsupported.', owner);
    }
    if (element.namespaceURI === NS.fipu && !EXT_ELEMENTS.has(element.localName)) report(`Unsupported execution extension: ${element.localName}.`, attr(element.closest?.('[id]'), 'id'));
    if (element.namespaceURI === NS.bpmn && element.localName === 'process' && attr(element, 'isExecutable') !== 'true') report('The Process must be executable.', id);
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.namespaceURI === NS.fipu && !(element.localName === 'endEvent' && attribute.localName === 'outcome')) report(`Unsupported execution attribute: ${attribute.localName}.`, id);
      else if (element.namespaceURI === NS.fipu && attribute.namespaceURI !== XMLNS && (attribute.namespaceURI || !(EXT_ATTRIBUTES[element.localName] || []).includes(attribute.localName))) report(`Unsupported ${element.localName} attribute: ${attribute.localName}.`, id);
    }
    if (element.namespaceURI === NS.fipu) {
      for (const item of Array.from(element.children)) if (item.namespaceURI !== NS.fipu || !(EXT_CHILDREN[element.localName] || []).includes(item.localName)) report(`Unsupported child ${item.localName} in ${element.localName}.`, id);
      const singles = ['connector', 'connectorId', 'inputOutput', 'formData', 'properties', 'validation'];
      for (const name of singles) if (children(element, NS.fipu, name).length > 1) report(`Duplicate ${name} execution extension.`, id);
    }
    if (element.namespaceURI === NS.bpmn && children(element, NS.bpmn, 'extensionElements').length > 1) report('Duplicate extensionElements containers are not supported.', id);
  }
  for (const flow of model.messageFlows) {
    const element = flow.id && elementById(model, flow.id);
    if (!flow.id || element?.parentElement?.localName !== 'collaboration') report('Message Flows belong to a Collaboration and require an ID.', flow.id);
    const endpoints = [...model.nodes, ...model.pools];
    if (flow.sourceRef === flow.targetRef || ![flow.sourceRef, flow.targetRef].every(ref => endpoints.some(item => item.id === ref))) report('Message Flows require distinct participant or node endpoints.', flow.id);
    if (flow.waypoints.length < 2 || flow.waypoints.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) report('Message Flows need at least two valid diagram waypoints.', flow.id);
  }
  for (const extension of all(document, NS.bpmn, 'extensionElements')) {
    const owner = extension.parentElement;
    const ownerId = attr(owner, 'id');
    const permitted = owner.localName === 'userTask' ? ['formData', 'inputOutput'] : ['serviceTask', 'sendTask'].includes(owner.localName) ? ['connector', 'inputOutput'] : owner.localName === 'process' ? ['properties'] : [];
    for (const element of Array.from(extension.children)) if (element.namespaceURI === NS.fipu && !permitted.includes(element.localName)) report(`Execution extension ${element.localName} is not supported on ${owner.localName}.`, ownerId);
    for (const name of ['connector', 'inputOutput', 'formData', 'properties']) if (children(extension, NS.fipu, name).length > 1) report(`Duplicate ${name} execution extension.`, ownerId);
    for (const element of all(extension, '*', '*')) if (element.namespaceURI !== NS.fipu) report(`Unsupported execution extension namespace: ${element.namespaceURI || '(none)'}.`, attr(extension.parentElement, 'id'));
  }
  for (const [containerName, itemName, key] of [['properties', 'property', 'id'], ['validation', 'constraint', 'name']]) {
    for (const container of all(document, NS.fipu, containerName)) {
      const values = new Set();
      for (const item of children(container, NS.fipu, itemName)) {
        const value = attr(item, key) || (itemName === 'property' ? attr(item, 'name') : '');
        if (!value || values.has(value)) report(`${itemName} entries require unique nonempty ${key} values.`);
        values.add(value);
      }
    }
  }
  for (const io of all(document, NS.fipu, 'inputOutput')) {
    for (const direction of ['input', 'output']) {
      const names = new Set();
      for (const parameter of children(io, NS.fipu, `${direction}Parameter`)) {
        const name = attr(parameter, 'name');
        if (!name || names.has(name)) report('Input/output parameters require unique nonempty names.');
        names.add(name);
        const containers = Array.from(parameter.children);
        if (containers.length > 1 || containers.some(element => element.namespaceURI !== NS.fipu || !['list', 'map'].includes(element.localName))) report(`Unsupported parameter structure: ${name}.`);
        for (const container of containers) {
          const keys = new Set();
          for (const item of Array.from(container.children)) {
            if (item.namespaceURI !== NS.fipu || item.localName !== (container.localName === 'list' ? 'value' : 'entry') || item.children.length) report(`Parameter ${name} supports only flat string lists and maps.`);
            if (container.localName === 'map') {
              const key = attr(item, 'key');
              if (!key || keys.has(key)) report(`Map parameter ${name} requires unique nonempty keys.`);
              keys.add(key);
            }
          }
        }
      }
    }
  }
  if (model.nodes.filter(node => node.type === 'startEvent').length !== 1) report('The Process must have exactly one Start Event.');
  if (!model.nodes.some(node => node.type === 'endEvent')) report('The Process must have an End Event.');
  const knownIds = new Set(model.nodes.map(node => node.id));
  const catalog = connectors ? (Array.isArray(connectors) ? connectors : connectors.connectors || []) : null;
  const connectorIds = catalog ? new Set(catalog.map(connector => connector.id)) : new Set(['baserow', 'emailjs', 'pdf']);
  for (const node of model.nodes) {
    if (!node.id) report('Every flow node requires an ID.');
    const incoming = model.flows.filter(flow => flow.targetRef === node.id);
    const outgoing = model.flows.filter(flow => flow.sourceRef === node.id);
    // shortcut: preserve Model B's historic detached placeholder; remove only with a workflow migration.
    if (node.id === 'Activity_0dri58t' && node.type === 'task' && !node.name && !incoming.length && !outgoing.length) {
      report('This legacy placeholder has no Sequence Flows and never runs.', node.id, 'warning');
      continue;
    }
    if (node.type === 'startEvent' && incoming.length) report('A Start Event cannot have incoming Sequence Flows.', node.id);
    if (node.type === 'endEvent' && outgoing.length) report('An End Event cannot have outgoing Sequence Flows.', node.id);
    if (node.type !== 'startEvent' && !incoming.length) report('This node has no incoming Sequence Flow.', node.id);
    if (node.type !== 'endEvent' && !outgoing.length) report(node.type === 'manualTask' && incoming.length ? 'This Manual Task ends its branch implicitly without an End Event.' : 'This node has no outgoing Sequence Flow.', node.id, node.type === 'manualTask' && incoming.length ? 'warning' : 'error');
    if (!diagramElement(model, 'BPMNShape', node.id) || ![node.x, node.y, node.width, node.height].every(Number.isFinite) || node.width <= 0 || node.height <= 0) report('This node needs valid BPMN diagram bounds.', node.id);
    const definitions = Array.from(elementById(model, node.id).children).filter(item => item.localName.endsWith('EventDefinition'));
    if (node.type === 'intermediateCatchEvent' && (definitions.length !== 1 || !['timerEventDefinition','messageEventDefinition'].includes(definitions[0].localName))) report('Intermediate Catch Events require one Timer or Message Event Definition.', node.id);
    if (node.timerDuration !== null && (node.type !== 'intermediateCatchEvent' || !validDuration(node.timerDuration) || definitions[0]?.children.length !== 1)) report('Invalid timer duration. Use PT15M, PT30S or P1D.', node.id);
    if (node.type === 'endEvent' && (definitions.length > 1 || definitions.some(item => item.localName !== 'terminateEventDefinition'))) report('Only normal and Terminate End Events are supported.', node.id);
    if (!['intermediateCatchEvent', 'endEvent'].includes(node.type) && definitions.length) report('Event definitions are not supported on this element.', node.id);
    if (!['finished', 'cancelled'].includes(node.outcome) || (node.outcome === 'cancelled' && !node.terminate)) report('Cancelled outcomes require a Terminate End Event.', node.id);
    if (node.type === 'exclusiveGateway') {
      if (node.default && !outgoing.some(flow => flow.id === node.default)) report('The default Sequence Flow must leave this Exclusive Gateway.', node.id);
      if (outgoing.some(flow => flow.id === node.default && flow.condition)) report('A default Sequence Flow cannot also have a condition in this execution profile.', node.id);
      if (outgoing.length > 1 && outgoing.some(flow => !flow.condition && flow.id !== node.default)) report('Each outgoing Exclusive Gateway flow needs a condition or must be its default.', node.id);
    }
    if (['serviceTask', 'sendTask'].includes(node.type)) {
      if (!node.connector) report('Configure a connector for this task.', node.id);
      else {
        if (!connectorIds.has(node.connector.id)) report('Choose a registered connector: Baserow, Email, or PDF.', node.id);
        if (!['GET', 'POST', 'PATCH'].includes(node.connector.method)) report('Connector method must be GET, POST, or PATCH.', node.id);
        let decodedPath = '';
        try { decodedPath = decodeURIComponent(node.connector.url); } catch { /* Invalid encoding is rejected below. */ }
        if (!/^\/(?!\/)[^\s?#]*$/.test(node.connector.url) || !decodedPath || decodedPath.split('/').includes('..')) report('Connector URL must be a relative path beginning with /, without a host, query, fragment, or parent traversal.', node.id);
        if (!node.connector.parameters || typeof node.connector.parameters !== 'object' || Array.isArray(node.connector.parameters)) report('Connector query parameters must be a string map.', node.id);
        const registered = catalog?.find(connector => connector.id === node.connector.id);
        if (registered?.operations && !registered.operations.some(operation => operation.method === node.connector.method && operation.url === node.connector.url)) report('This method and path are not a registered connector operation.', node.id);
        if (registered?.templates && !registered.templates.includes(node.connector.parameters?.template)) report('Choose a registered email template in the connector query parameters.', node.id);
        if (registered?.templates && (typeof node.connector.parameters?.to !== 'string' || !node.connector.parameters.to.trim())) report('Email connectors require a recipient in the to query parameter.', node.id);
      }
    }
    const fields = new Set();
    for (const field of node.formFields) {
      if (!field.id || !field.type || fields.has(field.id)) report('Form fields require unique IDs and a type.', node.id);
      fields.add(field.id);
    }
    const element = elementById(model, node.id);
    for (const [direction, endpoint] of [['incoming', 'targetRef'], ['outgoing', 'sourceRef']]) {
      const references = new Set();
      for (const reference of children(element, NS.bpmn, direction)) {
        const flowId = reference.textContent.trim();
        if (references.has(flowId) || !model.flows.some(flow => flow.id === flowId && flow[endpoint] === node.id)) report(`Invalid or duplicate ${direction} Sequence Flow reference.`, node.id);
        references.add(flowId);
      }
    }
  }
  for (const flow of model.flows) {
    if (!knownIds.has(flow.sourceRef) || !knownIds.has(flow.targetRef)) report('Sequence Flow endpoints must reference flow nodes in this Process.', flow.id);
    if (flow.sourceRef === flow.targetRef) report('A Sequence Flow cannot connect a node to itself.', flow.id);
    if (flow.condition && !/^[^\s:]+:.+$/.test(flow.condition)) report('Conditions use the engine format variable:value (for example approved:true).', flow.id);
    if (flow.condition && model.nodes.find(node => node.id === flow.sourceRef)?.type !== 'exclusiveGateway') report('The Praksa engine only evaluates conditions leaving Exclusive Gateways.', flow.id);
    if (flow.waypoints.length < 2 || flow.waypoints.some(point => !Number.isFinite(point.x) || !Number.isFinite(point.y))) report('Sequence Flows need at least two valid diagram waypoints.', flow.id);
    for (const [direction, endpoint] of [['outgoing', flow.sourceRef], ['incoming', flow.targetRef]]) {
      const owner = all(document, NS.bpmn, '*').find(element => attr(element, 'id') === endpoint);
      if (children(owner, NS.bpmn, direction).filter(reference => reference.textContent.trim() === flow.id).length !== 1) report(`Sequence Flow requires exactly one reciprocal ${direction} reference on ${endpoint}.`, flow.id);
    }
  }
  for (const reference of all(document, NS.bpmn, 'flowNodeRef')) if (!knownIds.has(reference.textContent.trim())) report('Lane refers to an unknown flow node.', attr(reference.parentElement, 'id'));
  for (const gateway of model.nodes.filter(node => node.type === 'parallelGateway')) {
    const pending = model.flows.filter(flow => flow.sourceRef === gateway.id).map(flow => flow.targetRef);
    const visited = new Set();
    while (pending.length) {
      const id = pending.pop();
      if (id === gateway.id) {
        report('Cycles through Parallel Gateways are not supported by this engine: join tokens are not reset between iterations.', gateway.id);
        break;
      }
      if (visited.has(id)) continue;
      visited.add(id);
      pending.push(...model.flows.filter(flow => flow.sourceRef === id).map(flow => flow.targetRef));
    }
  }
  const reachable = new Set();
  const visit = id => { if (reachable.has(id)) return; reachable.add(id); for (const flow of model.flows.filter(item => item.sourceRef === id)) visit(flow.targetRef); };
  for (const start of model.nodes.filter(node => node.type === 'startEvent')) visit(start.id);
  for (const node of model.nodes) if (!reachable.has(node.id) && diagramElement(model, 'BPMNShape', node.id) && !(node.id === 'Activity_0dri58t' && node.type === 'task' && !node.name && !model.flows.some(flow => flow.sourceRef === node.id || flow.targetRef === node.id))) report('This node is unreachable from the Start Event.', node.id);
  return issues;
}
