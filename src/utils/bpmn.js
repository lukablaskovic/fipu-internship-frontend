let BpmnXml = {
  getExtension(element, type) {
    if (!element.extensionElements) {
      return;
    }

    return element.extensionElements.values.filter((extensionElement) => {
      return extensionElement.$instanceOf(type);
    })[0];
  },
  setExtension(element, type, value, moddle) {
    if (!element.extensionElements) {
      element.extensionElements = moddle.create("bpmn:ExtensionElements");
      element.extensionElements.get("values").push(value);
    }

    for (let i = 0; i < element.extensionElements.values.length; i++) {
      let o = element.extensionElements.values[i];
      if (o.$type == type) {
        element.extensionElements.values[i] == value;
      }
    }
  },
};

let FormItemMetaModel = {
  string: {
    type: "string",
    name: "Short text",
    icon: "mdi-text-short",
  },
  "rich-text": {
    type: "rich-text",
    name: "Text",
    icon: "mdi-text-long",
  },
  integer: {
    type: "integer",
    name: "Numeric",
    icon: "mdi-numeric",
  },
  "autocomplete-string": {
    type: "autocomplete-string",
    name: "Autocomplete",
    icon: "mdi-text-search",
  },
  date: {
    type: "date",
    name: "Date",
    icon: "mdi-calendar",
  },
  dropdown: {
    type: "dropdown",
    name: "Dropdown",
    icon: "mdi-form-dropdown",
  },
  file: {
    type: "file",
    name: "File",
    icon: "mdi-file-outline",
  },
  boolean: {
    type: "boolean",
    name: "Boolean",
    icon: "mdi-check",
  },
  "yes-no-boolean": {
    name: "Yes/No",
    type: "yes-no-boolean",
    icon: "mdi-check",
  },
};

export { BpmnXml, FormItemMetaModel };
