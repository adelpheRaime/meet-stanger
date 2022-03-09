import Cookie from "universal-cookie";
import jwt_decode from "jwt-decode";
const cookie = new Cookie();
/**
 * jwt decode for client
 * @return {Object} user
 * @return {Boolean}
 */
export default function Isloggedin() {
  const token = cookie.get("_fXeTk") ? cookie.get("_fXeTk") : undefined;
  if (token) {
    const decode = jwt_decode(token);
    return decode;
  } else {
    return false;
  }
}
