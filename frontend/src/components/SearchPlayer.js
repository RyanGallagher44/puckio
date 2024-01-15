import React from 'react';
import {
    TextField, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchPlayer = (props) => {
    const handleChange = (e) => {
        props.searchValue(e.target.value);
    };

    return (<form
        method="POST"
        onSubmit={(e) => {
            e.preventDefault();
        }}
        name="formName"
    >
        <TextField
            id="search-bar"
            className="text"
            onInput={handleChange}
            label="Search"
            variant="outlined"
            placeholder="Search for any active player"
            size="small"
            sx={{
                '& label': {
                    color: '#FAF9F6'
                }, '& label.Mui-focused': {
                    color: '#FAF9F6',
                }, '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#FAF9F6',
                    }, '&:hover fieldset': {
                        borderColor: '#FAF9F6',
                    }, '&.Mui-focused fieldset': {
                        borderColor: '#FAF9F6',
                    }
                }, input: {
                    color: '#FAF9F6'
                }
            }}
        />
        <IconButton type="submit" aria-label="search">
            <SearchIcon style={{fill: "#FAF9F6"}}/>
        </IconButton>
    </form>);
};

export default SearchPlayer;