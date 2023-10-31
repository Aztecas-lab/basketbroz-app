import moment from "moment-timezone";
import React, { useCallback } from "react";

import env from "../env";
import useAuthUser from "./useAuthUser";

const readTimeout = 30 * 1000;
const TAG = "[useApi]";

const fetchWithTimeout = (method, url, formData, token) => {
  console.log(`${TAG} ${method}:${url}, formData=${JSON.stringify(formData)}`);
  return Promise.race([
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: "Read server timeout" });
      }, readTimeout);
    }),
    new Promise((resolve) => {
      const request = {
        method: method,
        headers: {
          Accept: "application/json",
          "X-BB-APP-TOKEN": env.BB_APP_TOKEN,
        },
      };
      if (formData && formData?._parts?.length > 0) {
        request.headers = {
          ...request.headers,
          "Content-Type": "multipart/form-data",
        };
        request.body = formData;
      }
      if (token) {
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      console.log(TAG, `${env.HOST}${url}`);
      fetch(`${env.HOST}${url}`, request)
        .then((resp) => {
          console.log("Response status:", resp.status);
          return resp.json();
        })
        .then((resp) => {
          console.log("Response in json:", resp);
          resolve(resp);
        })
        .catch((err) => {
          console.warn("Exception:", err);
          resolve(err);
        });
    }),
  ]);
};

/**
 * GET
 * @param {*} path
 * @param {*} token
 * @returns
 */
const get = (path, token = null) => {
  return fetchWithTimeout("GET", path, null, token);
};

/**
 * POST
 * @param {*} path
 * @param {*} params
 * @param {*} token
 * @returns
 */
const post = (path, params = {}, token = null) => {
  const formData = new FormData();
  if (params != null) {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value) {
        formData.append(key, value);
      }
    });
  }
  return fetchWithTimeout("POST", path, formData, token);
};

const useApi = () => {
  const { authToken, setAuthToken, setAuthUser } = useAuthUser();

  /**
   * Log in SNS
   */
  const login = async ({ snsType, snsToken }) => {
    const path = `/api/auth/login`;
    const result = await post(path, {
      service_type: snsType,
      sns_token: snsToken,
    });
    const isValidResult = result.access_token != null && result.data != null;
    if (isValidResult) {
      setAuthToken(result.access_token);
      setAuthUser(result.data);
    }
    return { success: isValidResult, ...result };
  };

  /**
   * register with Apple
   */
  const registerApple = async ({ token }) => {
    const path = `/api/auth/register/apple`;
    const result = await post(path, { token: token });
    return { success: result.sns_token != null, ...result };
  };

  /**
   * Log out
   */
  const logout = useCallback(async () => {
    const path = `/api/auth/logout`;
    const result = await post(path, null, authToken);
    const isValidResult = result?.data != null;
    if (isValidResult) {
      setAuthToken(null);
      setAuthUser(null);
    }
    return { success: isValidResult };
  }, [authToken, setAuthToken, setAuthUser]);

  /**
   * Get current loged in user
   */
  const getUser = useCallback(async () => {
    const path = `/api/user`;
    const result = await get(path, authToken);
    const isValidResult = result?.data != null;
    if (isValidResult) {
      setAuthUser(result.data);
    } else {
      if (result.message === "Unauthenticated.") {
        setAuthToken(null);
        setAuthUser(null);
      }
    }
    return { success: isValidResult, message: result.message ?? "" };
  }, [authToken, setAuthUser, setAuthToken]);

  /**
   * Update user properties
   */
  const updateUser = useCallback(
    async ({ username = null, name = null, avatar = null }) => {
      const path = `/api/user/update`;
      const result = await post(path, { username, name, avatar }, authToken);
      const isValidResult = result?.data != null;
      if (isValidResult) {
        setAuthUser(result?.data);
      }
      return { success: isValidResult };
    },
    [authToken, setAuthUser]
  );

  /**
   * Get detail game schedules(default a week)
   */
  const getGamesDetailbyDate = useCallback(
    async (payload) => {
      let startAt = payload?.start_at;
      let endAt = payload?.end_at;
      if (payload?.start_at == null || payload?.end_at == null) {
        console.log("start and end time is not specified");
        // startAt = moment().format('YYYY-MM-DD');
        startAt = moment().startOf("day").utc().format("YYYY-MM-DD");
        endAt = moment(startAt).add(7, "days").format("YYYY-MM-DD");
        console.log("use default start at:", startAt);
        console.log("use default end at:", endAt);
      }
      const path = `/api/nba/schedules?start_at=${startAt}&end_at=${endAt}`;

      if (payload?.home_team_id != null) {
        path.concat(`$home_team_id=${payload?.home_team_id}`);
      }
      if (payload?.away_team_id != null) {
        path.concat(`$away_team_id=${payload?.away_team_id}`);
      }
      const result = await get(path, authToken);
      const isValidResult = result?.data != null;
      return { success: isValidResult, ...result };
    },
    [authToken]
  );

  /**
   * Get simple game schedule for a year
   */
  const getGameSchedules = useCallback(
    async (payload) => {
      let startAt = payload?.start_at;
      let endAt = payload?.end_at;
      if (payload?.start_at == null || payload?.start_at == null) {
        startAt = moment().startOf("month").format("YYYY-MM-DD");
        endAt = moment().endOf("month").format("YYYY-MM-DD");
      }
      const path = `/api/nba/schedules/game-date?start_at=${startAt}&end_at=${endAt}&page_size=100`;
      const result = await get(path, authToken);
      const isValidResult = result?.data != null;
      return { success: isValidResult, ...result };
    },
    [authToken]
  );

  return {
    getUser,
    login,
    logout,
    updateUser,
    getGamesDetailbyDate,
    getGameSchedules,
    registerApple,
  };
};

export default useApi;
