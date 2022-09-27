import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';

const nameParts = (name) => name.split('_');
const hasProjectAssigned = (name) => name.includes('uuid_');
export const getElementWithoutProjectUuidInName = (element) => {
  if (isNotOpenstackBuild) {
    return element;
  }
  if (!hasProjectAssigned(element.name)) {
    return element;
  }
  return { ...element, name: nameParts(element.name).slice(2).join('') };
};

export const getElementsWithoutProjectUuidInName = (elements: any[]) =>
  elements.map(getElementWithoutProjectUuidInName);
