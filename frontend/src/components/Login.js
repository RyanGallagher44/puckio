import React from 'react';
import {
    Box, Avatar, Typography, Grid, TextField, Button
} from '@mui/material';
import axios from 'axios';
import LoginIcon from '@mui/icons-material/Login';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const LoginSwal = withReactContent(Swal);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        let body = {
            email: data.get('email'), password: data.get('password')
        };

        LoginSwal.fire({
            color: '#0C0C0C', background: '#FAF9F6', text: 'Logging In', didOpen: () => {
                LoginSwal.showLoading()
            }, allowOutsideClick: false
        });

        const res = await axios.post('/user/login', body, {withCredentials: true});

        if (res.data.auth) {
            LoginSwal.fire({
                text: `Welcome back, ${res.data.user.firstName}!`,
                icon: 'success',
                confirmButtonColor: '#0C0C0C',
                confirmButtonText: 'Go to Profile',
                allowOutsideClick: false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    localStorage.setItem('log', 'true');
                    navigate('/profile');
                }
            })
        } else {
            LoginSwal.fire({
                text: res.data.error,
                icon: 'error',
                confirmButtonColor: '#0C0C0C',
                confirmButtonText: 'Try Again',
                allowOutsideClick: false
            })
        }
    };

    return (<Box
        sx={{
            marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
    >
        <Avatar sx={{m: 1, bgcolor: '#FAF9F6'}}>
            <LoginIcon sx={{color: '#0C0C0C'}}/>
        </Avatar>
        <Typography sx={{color: '#FAF9F6'}} component="h1" variant="h5">
            Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3, mr: 16, ml: 16}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
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
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        sx={{
                            '& label': {
                                color: '#FAF9F6'
                            }, '& label.Mui-focused': {
                                color: '#FAF9F6'
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
                </Grid>
            </Grid>
            <Button
                type="submit"
                variant="contained"
                sx={{
                    mt: 4, mb: 8, backgroundColor: '#FAF9F6', color: '#0C0C0C', '&:hover': {
                        backgroundColor: '#FAF9F6'
                    }
                }}
            >
                Login
            </Button>
            {/* <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid> */}
        </Box>
    </Box>);
};

export default Login;