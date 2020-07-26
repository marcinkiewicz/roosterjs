import { safeInstanceOf } from 'roosterjs-editor-dom';

/**
 * @internal
 * Converter for dark mode that runs all child elements of a node through the content transform function.
 * @param node The node containing HTML elements to convert.
 * @param skipRootElement Optional parameter to skip the root element of the Node passed in, if applicable.
 */
export function convertContentToDarkMode(
    node: Node,
    onExternalContentTransform?: (element: Element) => void,
    skipRootElement?: boolean
): () => void {
    let childElements: HTMLElement[] = [];

    // Get a list of all the decendents of a node.
    // querySelectorAll doesn't return a live list when called on an HTMLElement
    // So we use getElementsByTagName instead for HTMLElement types.
    if (safeInstanceOf(node, 'HTMLElement')) {
        childElements = Array.prototype.slice.call(node.getElementsByTagName('*'));
        if (!skipRootElement) {
            childElements.unshift(node);
        }
    } else if (safeInstanceOf(node, 'DocumentFragment')) {
        childElements = Array.prototype.slice.call(node.querySelectorAll('*'));
    }

    return childElements.length > 0
        ? () => {
              childElements.forEach(element => {
                  if (onExternalContentTransform) {
                      onExternalContentTransform(element);
                  } else {
                      element.style.color = null;
                      element.style.backgroundColor = null;
                  }
              });
          }
        : null;
}
