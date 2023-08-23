import { reduce, keys, forEach } from "min-dash";

import { is } from "bpmn-js/lib/util/ModelUtil";

/**
 * A handler that implements a BPMN 2.0 property update
 * for business object lists which are not represented in the
 * diagram.
 *
 * This is useful in the context of the properties panel in
 * order to update child elements of elements visible in
 * the diagram.
 *
 * Example: perform an update of a specific event definition
 * of an intermediate event.
 *
 */
class UpdateBusinessObjectListHandler {
  constructor(elementRegistry, bpmnFactory) {
    this._elementRegistry = elementRegistry;
    this._bpmnFactory = bpmnFactory;
  }

  // api /////////////////////////////////////////////

  /**
   * Updates a element under a provided parent.
   */
  execute(context) {
    const currentObject = ensureNotNull(context.currentObject, "currentObject"),
      propertyName = ensureNotNull(context.propertyName, "propertyName"),
      updatedObjectList = context.updatedObjectList,
      objectsToRemove = context.objectsToRemove || [],
      objectsToAdd = context.objectsToAdd || [],
      objectsToPrepend = context.objectsToPrepend || [],
      changed = [context.element]; // this will not change any diagram-js elements

    let referencePropertyName;

    if (context.referencePropertyName) {
      referencePropertyName = context.referencePropertyName;
    }

    const objectList = currentObject[propertyName];

    // adjust array reference in the parent business object
    context.previousList = currentObject[propertyName];

    if (updatedObjectList) {
      currentObject[propertyName] = updatedObjectList;
    } else {
      // start with objects to prepend
      let listCopy = objectsToPrepend.slice();

      // remove all objects which should be removed
      forEach(objectList, function (object) {
        if (objectsToRemove.indexOf(object) == -1) {
          listCopy.push(object);
        }
      });

      // add all objects which should be added
      listCopy = listCopy.concat(objectsToAdd);

      // set property to new list
      if (listCopy.length > 0 || !referencePropertyName) {
        // as long as there are elements in the list update the list
        currentObject[propertyName] = listCopy;
      } else if (referencePropertyName) {
        // remove the list when it is empty
        const parentObject = currentObject.$parent;
        parentObject[referencePropertyName] = undefined;
      }
    }

    context.changed = changed;

    // indicate changed on objects affected by the update
    return changed;
  }

  /**
   * Reverts the update
   *
   * @method  CreateBusinessObjectListHandler#revert
   *
   * @param {Object} context
   *
   * @return {djs.mode.Base} the updated element
   */
  revert(context) {
    const currentObject = context.currentObject,
      propertyName = context.propertyName,
      previousList = context.previousList,
      parentObject = currentObject.$parent;

    if (context.referencePropertyName) {
      //parentObject.set(context.referencePropertyName, currentObject);
      parentObject[context.referencePropertyName] = currentObject;
    }

    // remove new element
    // currentObject.set(propertyName, previousList);
    currentObject[propertyName] = previousList;

    return context.changed;
  }
}

UpdateBusinessObjectListHandler.$inject = ["elementRegistry", "bpmnFactory"];

/**
 * A handler that implements a BPMN 2.0 property update
 * for business objects which are not represented in the
 * diagram.
 *
 * This is useful in the context of the properties panel in
 * order to update child elements of elements visible in
 * the diagram.
 *
 * Example: perform an update of a specific event definition
 * of an intermediate event.
 */
class UpdateBusinessObjectHandler {
  constructor(elementRegistry) {
    this._elementRegistry = elementRegistry;
  }

  // api /////////////////////////////////////////////

  /**
   * Updates a business object with a list of new properties
   *
   * @method  UpdateBusinessObjectHandler#execute
   *
   * @param {Object} context
   * @param {djs.model.Base} context.element the element which has a child business object updated
   * @param {moddle.businessObject} context.businessObject the businessObject to update
   * @param {Object} context.properties a list of properties to set on the businessObject
   *
   * @return {Array<djs.mode.Base>} the updated element
   */
  execute(context) {
    const element = context.element,
      businessObject = context.businessObject,
      rootElements = getRoot(businessObject).rootElements,
      referenceType = context.referenceType,
      referenceProperty = context.referenceProperty,
      changed = [element]; // this will not change any diagram-js elements

    if (!element) {
      throw new Error("element required");
    }

    if (!businessObject) {
      throw new Error("businessObject required");
    }

    const properties = context.properties,
      oldProperties =
        context.oldProperties ||
        getProperties(businessObject, keys(properties));

    // check if there the update needs an external element for reference
    if (
      typeof referenceType !== "undefined" &&
      typeof referenceProperty !== "undefined"
    ) {
      forEach(rootElements, function (rootElement) {
        if (is(rootElement, referenceType)) {
          if (rootElement.id === properties[referenceProperty]) {
            properties[referenceProperty] = rootElement;
          }
        }
      });
    }

    // update properties
    setProperties(businessObject, properties);

    // store old values
    context.oldProperties = oldProperties;
    context.changed = changed;

    // indicate changed on objects affected by the update
    return changed;
  }

  /**
   * Reverts the update
   *
   * @method  UpdateBusinessObjectHandler#revert
   *
   * @param {Object} context
   *
   * @return {djs.mode.Base} the updated element
   */
  revert(context) {
    const oldProperties = context.oldProperties,
      businessObject = context.businessObject;

    // update properties
    setProperties(businessObject, oldProperties);

    return context.changed;
  }
}

UpdateBusinessObjectHandler.$inject = ["elementRegistry"];

/**
 * A handler that combines and executes multiple commands.
 *
 * All updates are bundled on the command stack and executed in one step.
 * This also makes it possible to revert the changes in one step.
 *
 * Example use case: remove the camunda:formKey attribute and in addition
 * add all form fields needed for the camunda:formData property.
 */
export default class MultiCommandHandler {
  constructor(commandStack) {
    this._commandStack = commandStack;
  }

  preExecute(context) {
    const commandStack = this._commandStack;

    forEach(context, function (command) {
      commandStack.execute(command.cmd, command.context);
    });
  }
}

MultiCommandHandler.$inject = ["commandStack"];

// helpers ///////////////////////

/**
 * returns the root element
 */
function getRoot(businessObject) {
  let parent = businessObject;
  while (parent.$parent) {
    parent = parent.$parent;
  }
  return parent;
}

function getProperties(businessObject, propertyNames) {
  return reduce(
    propertyNames,
    function (result, key) {
      result[key] = businessObject[key];
      return result;
    },
    {}
  );
}

function setProperties(businessObject, properties) {
  forEach(properties, function (value, key) {
    businessObject[key] = value;
  });
}

function ensureNotNull(prop, name) {
  if (!prop) {
    throw new Error(name + "required");
  }
  return prop;
}

export {
  UpdateBusinessObjectListHandler,
  UpdateBusinessObjectHandler,
  MultiCommandHandler,
};
