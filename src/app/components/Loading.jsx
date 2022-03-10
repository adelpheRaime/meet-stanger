import React from 'react'
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync"

// import fountain from "../../../public/images/fountain.gif"
// import circle from "../../../public/images/circle.gif"
export default function Loading() {
    return (
        <>
            <Box display="flex" style={{ minHeight: "75vh" }} justifyContent="center" alignItems="center" alignColumn="center" flexDirection="column">
                <FontAwesomeIcon icon={faSync} size={32} className="fa-spin" />
            </Box>
            {/* <img src={image} style={{ width: "5rem" }} /> */}

        </>
    )
}
