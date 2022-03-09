import React from "react"
import { Helmet } from 'react-helmet';
const NoMatch = () => {
    return (
        <>
            <Helmet>
                <title>Meet-Stranger | 401</title>
            </Helmet>
            <div style={{ minHeight: "100vh", width: "100%", alignItems: "center", alignColumn: "center", fontSize: "2rem", display: "flex", justifyContent: "center" }}>
                <strong>Page not found</strong>
            </div>
        </>
    )
}
export default NoMatch