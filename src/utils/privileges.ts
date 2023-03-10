export const userHasPrivilege = (privileges: string | string[]): boolean => {
  const userPrivileges = JSON.parse(
    localStorage.getItem('user'),
  )?.privileges.map((item) => item.name);

  if (typeof privileges === 'string') {
    privileges = [privileges];
  }

  return userPrivileges.some((privilege) => privileges.includes(privilege));
};
