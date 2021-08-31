import getCookie from 'utils/getCookie';
import config from 'utils/config';

const nameParts = (name) => name.split('_');
const hasProjectAssigned = (name) => name.includes('uuid_');
export const getElementWithoutProjectUuidInName = (policy) => {
  if (config.build !== 'OPENSTACK') {
    return policy;
  }
  if (!hasProjectAssigned(policy.name)) {
    return policy;
  }
  return { ...policy, name: nameParts(policy.name).slice(2).join('') };
};

export const getElementWithProjectUuidInName = (policy) => {
  return {
    ...policy,
    ...(config.build !== 'OPENSTACK'
      ? {}
      : { name: `uuid_${getCookie('recent_project')}_${policy.name}` }),
  };
};

export const getElementsWithoutProjectUuidInName = (elements: any[]) =>
  elements
    .filter((el) => {
      return (
        !hasProjectAssigned(el.name) ||
        nameParts(el.name)[1] === getCookie('recent_project')
      );
    })
    .map(getElementWithoutProjectUuidInName);
