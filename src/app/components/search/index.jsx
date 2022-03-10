import React, {  useEffect, useState,useRef } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch"
import styled from '@mui/material/styles/styled';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useFetch from "../../useFetch"
import { useStates } from "from-react-context"
const Search=()=>{
    
    const searchValue = useRef()
    const [Users, setUsers] = useStates("UserLists")
    const { send: filter } = useFetch("users/filter", {
    method: "POST",
        onCompleted: (data) => {
        setUsers(data)
        }
    })
    function _filter() {
        filter({
        ref: searchValue.current.value
        })
    }
    return (
        <>
        <Box display="flex" >
            <IconButton color="primary">
                <FontAwesomeIcon size={32} icon={faSearch} />
            </IconButton>
            <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search user"
            inputRef={searchValue}
            onChange={_filter}
            />
        </Box> 
        </>
    )
}

export default Search