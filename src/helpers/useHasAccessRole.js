const useHasAccessRole = () => {
    const userRoles = localStorage.getItem('roles');
  
    const rolesList = userRoles ? userRoles.split(',') : [];
    let roles = {};
  
    rolesList.map((item) => {
      if (!item.includes('-')) return;
      const role = item.split('-').map((name) => name.charAt(0).toLowerCase() + name.slice(1));
      roles = { ...roles, [role[0]]: { ...roles[role[0]], any: true, [role[1]]: true } };
    });
   
    const hasAccessTo = (passedRole, test) => {
      if (test) return false;
      if (!userRoles) return false;
      if (rolesList.includes('Admin')) return true;
      if (rolesList.includes('SuperAdmin')) return true;
      return !!passedRole;
    };
  
    return { roles, hasAccessTo };
  };
  
  export default useHasAccessRole;
  