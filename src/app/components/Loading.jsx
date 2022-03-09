import React from 'react'
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync"
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
