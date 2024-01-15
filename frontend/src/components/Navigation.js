import React, {useEffect, useState} from 'react';
import {
    AppBar, Container, Toolbar, Typography, Box, Tooltip, Avatar, Menu, MenuItem, IconButton
} from '@mui/material';
import AvatarImage from '../img/avatar.png';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Navigation = () => {
    const [profile, setProfile] = useState(undefined);
    const LogoutSwal = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const {data} = await axios.get('/user/profile');
            if (!data.error) {
                setProfile(data);
            }
        }

        fetchData();
    }, []);

    const pages = [{
        name: 'Teams', link: '/teams'
    }, {
        name: 'Scores',
        link: `/schedule/${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}-${('0' + (new Date().getDate())).slice(-2)}`
    }, {
        name: 'Standings', link: '/standings'
    }];

    let settings = undefined;
    if (!profile) {
        settings = [{
            name: 'Register', link: '/register'
        }, {
            name: 'Login', link: '/login'
        }];
    } else {
        settings = [{
            name: 'Profile', link: '/profile'
        }, {
            name: 'Logout', link: '/logout'
        }];
    }

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        LogoutSwal.fire({
            color: '#0C0C0C', background: '#FAF9F6', text: 'Logging Out', didOpen: () => {
                LogoutSwal.showLoading()
            }, allowOutsideClick: false
        });

        await axios.get('/user/logout');

        LogoutSwal.fire({
            text: `Goodbye, ${profile.user.firstName}!`,
            icon: 'success',
            confirmButtonColor: '#0C0C0C',
            confirmButtonText: 'Go to Login',
            allowOutsideClick: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                setProfile(undefined);
                navigate('/login');
            }
        })
    };

    return (<AppBar
        position="static"
        sx={{
            backgroundColor: '#0C0C0C'
        }}
    >
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href=""
                    sx={{
                        display: {xs: 'none', md: 'flex'}, color: '#FAF9F6', textDecoration: 'none',
                    }}
                >
                    puck.io
                </Typography>
                {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}> */}
                {/* <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    sx={{
                        color: '#0C0C0C'
                    }}
                    >
                    <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiPaper-root': {
                        backgroundColor: '#FAF9F6'
                        }
                    }}
                    >
                    {pages.map((page) => (
                        <Link className="menu-link" to={page.link}>
                        <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                            <Typography textAlign="center">{page.name}</Typography>
                        </MenuItem>
                        </Link>
                    ))}
                    </Menu> */}
                {/* </Box> */}
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href=""
                    sx={{
                        display: {xs: 'flex', md: 'none'}, flexGrow: 1, color: '#FAF9F6', textDecoration: 'none',
                    }}
                >
                    puck.io
                </Typography>
                <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                    {/* {pages.map((page) => (
                        <Link className="menu-link" to={page.link}>
                            <Button
                            key={page.name}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: '#FAF9F6', display: 'block' }}
                            >
                            {page.name}
                            </Button>
                        </Link>
                    ))} */}
                </Box>

                <Box sx={{flexGrow: 0}}>
                    <Tooltip title="Profile settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                            {!profile && <Avatar alt="Remy Sharp" src={AvatarImage}/>}
                            {profile && <Avatar sx={{borderRadius: '0px'}} alt="Remy Sharp"
                                                src={profile.user.favoriteTeamImageUrl}/>}
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{mt: '45px'}}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => {
                            return (<div>
                                {setting.name !== 'Logout' && <Link to={setting.link}>
                                    <MenuItem sx={{color: '#0C0C0C'}} key={setting.name}
                                              onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                    </MenuItem>
                                </Link>}
                                {setting.name === 'Logout' &&
                                    <MenuItem sx={{color: '#0C0C0C'}} key={setting.name} onClick={handleLogout}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                    </MenuItem>}
                            </div>);
                        })}
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>);
};

export default Navigation;