import React, {useState, useEffect} from 'react';
import SearchPlayer from './SearchPlayer';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {
    List, ListItem, ListItemText, ListItemAvatar, Typography, Box
} from '@mui/material';
import NoProfPic from '../img/avatar.png';

const Search = () => {
    const [searchData, setSearchData] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setSearchData([]);

        async function fetchData() {
            try {
                const {data} = await axios.get(`/player/search/${searchTerm}`);
                setSearchData(data);
            } catch (e) {
                console.log(e);
            }
        }

        if (searchTerm) {
            fetchData();
        }
    }, [searchTerm]);

    const searchValue = async (value) => {
        setSearchTerm(value);
    };

    return (<Box
        sx={{
            padding: '25px'
        }}
    >
        <SearchPlayer searchValue={searchValue}/>
        {searchData && <List>
            {searchData.map((result) => {
                return (<Link className="player-search-link" to={`/player/${result.id}`}>
                    <ListItem key={Math.random()}>
                        <ListItemAvatar>
                            {<img
                                style={{borderRadius: '25px'}}
                                width="50px"
                                src={result.imageUrl}
                                alt={` logo`}
                                onError={({currentTarget}) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = NoProfPic;
                                }}
                            />}
                        </ListItemAvatar>
                        <ListItemText primary={result.name} secondary={<Typography
                            sx={{color: '#FAF9F6'}}>{result.team}</Typography>}/>
                    </ListItem>
                </Link>);
            })}
        </List>}
        {searchData && searchData.length === 0 &&
            <Typography sx={{color: '#FAF9F6'}}>There are no search results!</Typography>}
    </Box>);
};

export default Search;