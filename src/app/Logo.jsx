import * as React from 'react';
import icon from "../../public/favicon.ico"
import { Link } from 'react-router-dom';
export default function Logo() {
  return (
    <>
      <Link to="/">
        <img src={icon} />
      </Link>
    </>
  )
}
