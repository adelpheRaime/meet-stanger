import * as React from "react";
import axios from "axios";
import Cookie from "universal-cookie";
import {baseUrl} from "./baseUrl"
const cookie = new Cookie();
/**
 * utility for file upload
 * @param {Object} file
 * @return {String} cloudinary path of uploaded file
 */
export default async function cloudinaryApi(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "kgh6anqv");
  const token = cookie.get("_fXeTk") ? cookie.get("_fXeTk") : null;
  const _csrf = cookie.get("_sfgzf_") ? cookie.get("_sfgzf_") : null;
  const instance=axios.create({
    baseUrl:baseUrl
  })  
  const res = await instance.post(`/upload`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
      "XSRF-TOKEN": _csrf,
    },
  });
  if (res.data.success) {
    return res.data.path;
  }
}
