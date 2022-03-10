import * as React from "react";
import Cookie from "universal-cookie";
import {baseUrl} from "./baseUrl"
const cookie = new Cookie();
const initialState = {
  loading: false,
  error: false,
  data: null,
};
/**
 * React hook for fetch API
 * @param {String=} link url of the request
 * @param {Object=} options
 * @return {Object}
 */
export default function useFetch(link, options) {
  const { method, onCompleted, headers, onError } = options;
  const [track, setTrack] = React.useState(initialState);
  const loading = track.loading;
  const data = track.data;
  const error = track.error;
  //authenticate token
  const token = cookie.get("_fXeTk") ? cookie.get("_fXeTk") : null;
  const _csrf = cookie.get("_sfgzf_") ? cookie.get("_sfgzf_") : null;
  const fetchHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json ,text/plain,*/*",
    Authorization: `Bearer ${token}`,
    "XSRF-TOKEN": _csrf,
  };
  if (typeof headers === "object") {
    Object.assign(fetchHeaders, { ...headers });
  }
  const send = (body) => {
    setTrack({
      ...track,
      loading: true,
    });
    fetch(baseUrl + "/" + link, {
      method: method,
      credentials: "include",
      headers: { ...fetchHeaders },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          return {
            type: "success",
            data: data,
          };
        } else {
          const error = await response.json();
          return {
            type: "error",
            data: error,
          };
        }
      })
      .then((payload) => {
        switch (payload.type) {
          case "success":
            if (onCompleted) {
              onCompleted(payload.data);
            }
            setTrack({
              ...track,
              loading: false,
              data: payload.data,
            });
            break;
          case "error":
            const error = payload.data;

            if (onError) {
              onError(error);
            }
            setTrack({
              ...track,
              loading: false,
              data: null,
              error: error,
            });
            break;
          default:
            setTrack({
              ...track,
            });
            break;
        }
      })
      .catch((err) => {
        if (onError) {
          onError("Request failed");
        }
        setTrack({
          ...track,
          loading: false,
          data: null,
          error: "Request failed",
        });
      });
  };

  return { loading, data, error, send };
}
