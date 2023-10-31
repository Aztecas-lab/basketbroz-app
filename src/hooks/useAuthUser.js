import React, { useContext, useEffect } from 'react';

import { AuthUserContext } from '../contexts/AuthUserContext';

const useAuthUser = () => {
  const { authUser, authToken, setAuthUser, setAuthToken } = useContext(AuthUserContext);
  return { authUser, authToken, setAuthUser, setAuthToken };
};

export default useAuthUser;
