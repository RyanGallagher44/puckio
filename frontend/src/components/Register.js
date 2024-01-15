import React, {useState} from 'react';
import {
    Box, Avatar, Grid, TextField, Typography, Button
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToRegOutlined';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {teams} from '../helpers.js';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const SelectFavoriteTeamSwal = withReactContent(Swal);
    const [favoriteTeam, setFavoriteTeam] = useState("Anaheim Ducks");
    const navigate = useNavigate();

    const handleFavoriteTeamChange = (event) => {
        console.log(event.target.value);
        setFavoriteTeam(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let result = await SelectFavoriteTeamSwal.fire({
            color: '#0C0C0C',
            background: '#FAF9F6',
            text: 'Your Favorite Team',
            input: 'select',
            inputOptions: teams, // html:
            //   <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            //     <Select
            //         labelId="demo-select-small"
            //         id="demo-select-small"
            //         defaultValue={favoriteTeam}
            //         onChange={handleFavoriteTeamChange}
            //         sx={{
            //             borderRadius: '50px',
            //             backgroundColor: '#FAF9F6'
            //         }}
            //     >
            //         {Object.keys(teams).map((team) => {
            //             return <MenuItem value={teams[team]}>{teams[team]}</MenuItem>
            //         })}
            //     </Select>
            //   </FormControl>,
            inputPlaceholder: 'Select a team',
            showCancelButton: true,
            confirmButtonText: 'Register',
            confirmButtonColor: '#0C0C0C',
        })
        if (result.isConfirmed) {
            const data = new FormData(event.target);
            let body = {
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                email: data.get('email'),
                password: data.get('password'),
                favoriteTeam: teams[result.value]
            };

            SelectFavoriteTeamSwal.fire({
                color: '#0C0C0C', background: '#FAF9F6', text: 'Creating Profile', didOpen: () => {
                    SelectFavoriteTeamSwal.showLoading()
                }, allowOutsideClick: false
            })

            const res = await axios.post('/user/register', body);

            if (res.data.auth) {
                SelectFavoriteTeamSwal.fire({
                    title: 'Account Created',
                    text: "Please click below to Login",
                    icon: 'success',
                    confirmButtonColor: '#0C0C0C',
                    confirmButtonText: 'Login',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login')
                    }
                })
            } else {
                SelectFavoriteTeamSwal.fire({
                    text: res.data.error,
                    icon: 'error',
                    confirmButtonColor: '#0C0C0C',
                    confirmButtonText: 'Try Again',
                    allowOutsideClick: false
                })
            }
        }
    };

    return (<Box
        sx={{
            marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
    >
        <Avatar sx={{m: 1, bgcolor: '#FAF9F6'}}>
            <HowToRegIcon sx={{color: '#0C0C0C'}}/>
        </Avatar>
        <Typography sx={{color: '#FAF9F6'}} component="h1" variant="h5">
            Register
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3, ml: 16, mr: 16}}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
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
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
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
                            },
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
                Register
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

export default Register;