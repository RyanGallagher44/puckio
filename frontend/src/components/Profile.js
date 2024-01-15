import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Stack,
    Typography,
    CircularProgress,
    Button,
    Box,
    Modal,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton
} from '@mui/material';
import {getTeamPrimaryColor} from '../helpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import InfoIcon from '@mui/icons-material/Info';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '300px',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px'
};

const Profile = () => {
    const [profileData, setProfileData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const RedeemPredictionsSwal = withReactContent(Swal);
    const [open, setOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInfoOpen = () => setInfoOpen(true);
    const handleInfoClose = () => setInfoOpen(false);

    if (localStorage.getItem('log')) {
        window.location.reload();
        localStorage.removeItem('log');
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await axios.get('/user/profile');
                setProfileData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, []);

    const handlePredictionRedemption = async () => {
        RedeemPredictionsSwal.fire({
            text: `Redeeming Predictions...`, didOpen: () => {
                RedeemPredictionsSwal.showLoading()
            }, allowOutsideClick: false
        });

        const {data} = await axios.post('/user/predictions/calculate');

        await RedeemPredictionsSwal.fire({
            text: data.success, icon: 'success', confirmButtonColor: '#0C0C0C'
        });

        window.location.reload();
    };

    if (loading) {
        return <CircularProgress sx={{marginTop: '50%', color: '#FAF9F6'}}/>
    } else {
        return (<Stack
            sx={{
                alignItems: 'center'
            }}
        >
            <Typography
                sx={{
                    fontSize: 24, mt: 3, color: '#FAF9F6'
                }}
            >
                {profileData.user.firstName} {profileData.user.lastName}
            </Typography>
            <Typography
                sx={{
                    fontSize: 16, mt: 3, color: '#FAF9F6'
                }}
            >
                Favorite NHL Team: {profileData.user.favoriteTeam}
            </Typography>
            <Typography
                sx={{
                    fontSize: 16, mt: 3, color: '#FAF9F6'
                }}
            >
                Predictions Made: {profileData.user.predictions.length}
            </Typography>
            <Box sx={{display: 'flex'}}>
                <Typography
                    sx={{
                        fontSize: 16, mt: 1, ml: 1, mr: 1, color: '#FAF9F6'
                    }}
                >
                    Redeemed: {(profileData.user.predictions.filter((prediction) => prediction.redeemed)).length}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 16, mt: 1, ml: 1, mr: 1, color: '#FAF9F6'
                    }}
                >
                    Pending: {(profileData.user.predictions.filter((prediction) => !prediction.redeemed)).length}
                </Typography>
            </Box>
            <Box sx={{mt: 3, position: 'relative', display: 'inline-flex'}}>
                <CircularProgress thickness={3} size={200}
                                  sx={{color: getTeamPrimaryColor(profileData.user.favoriteTeam)}}
                                  variant="determinate"
                                  value={(profileData.user.currentPoints / profileData.user.nextLevel) * 100}/>
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" sx={{fontSize: 24, color: '#FAF9F6'}}>
                        {profileData.user.currentPoints}/{profileData.user.nextLevel}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{display: 'flex'}}>
                <Typography
                    sx={{
                        fontSize: 16, mt: 3, ml: 1, mr: 1, color: '#FAF9F6'
                    }}
                >
                    Current Level: {profileData.user.level}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 16, mt: 3, ml: 1, mr: 1, color: '#FAF9F6'
                    }}
                >
                    Total Points: {profileData.user.totalPoints}
                </Typography>
            </Box>
            <Button
                sx={{
                    backgroundColor: '#FAF9F6', color: '#0C0C0C', mt: 1, '&:hover': {
                        backgroundColor: '#E1D9D1', color: '#0C0C0C',
                    }, width: '200px'
                }}
                onClick={handleOpen}
            >
                View Predictions
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Prediction Results
                    </Typography>
                    <List sx={{overflow: 'auto', position: 'relative', maxHeight: '300px'}}>
                        {profileData.user.predictions.map((prediction) => {
                            return (<Box>
                                <ListItem
                                    key={Math.random()}
                                    secondaryAction={<Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Stack sx={{alignItems: 'center'}}>
                                            <Box sx={{display: 'flex'}}>
                                                <Avatar sx={{p: 1, width: '25px', height: '25px'}}
                                                        src={prediction.awayImage}/>
                                                <Avatar sx={{p: 1, width: '25px', height: '25px'}}
                                                        src={prediction.homeImage}/>
                                            </Box>
                                            <Typography
                                                sx={{fontSize: 10}}>{prediction.gameDate}</Typography>
                                        </Stack>
                                        {prediction.redeemed && <Typography sx={{fontSize: 10}}>
                                            +{prediction.pointsEarned}
                                        </Typography>}
                                        {!prediction.redeemed && <Typography sx={{fontSize: 10}}>
                                            ...
                                        </Typography>}
                                    </Box>}
                                >
                                    <ListItemAvatar>
                                        {prediction.redeemed && <CheckCircleIcon
                                            sx={{color: getTeamPrimaryColor(profileData.user.favoriteTeam)}}/>}
                                        {!prediction.redeemed && <PendingIcon sx={{color: '#0C0C0C'}}/>}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Box>
                                            {prediction.homeScore > prediction.awayScore &&
                                                <Typography sx={{fontSize: 12}}>
                                                    {`You: ${prediction.homeTriCode} ${prediction.homeScore} - ${prediction.awayTriCode} ${prediction.awayScore}`}
                                                </Typography>}
                                            {prediction.homeScore < prediction.awayScore &&
                                                <Typography sx={{fontSize: 12}}>
                                                    {`You: ${prediction.awayTriCode} ${prediction.awayScore} - ${prediction.homeTriCode} ${prediction.homeScore}`}
                                                </Typography>}
                                        </Box>}
                                        secondary={<Box>
                                            {prediction.actualHomeScore > prediction.actualAwayScore &&
                                                <Typography sx={{fontSize: 12}}>
                                                    {`Actual: ${prediction.homeTriCode} ${prediction.actualHomeScore} - ${prediction.awayTriCode} ${prediction.actualAwayScore}`}
                                                </Typography>}
                                            {prediction.actualHomeScore < prediction.actualAwayScore &&
                                                <Typography sx={{fontSize: 12}}>
                                                    {`Actual: ${prediction.awayTriCode} ${prediction.actualAwayScore} - ${prediction.homeTriCode} ${prediction.actualHomeScore}`}
                                                </Typography>}
                                        </Box>}
                                    />
                                </ListItem>
                            </Box>);
                        })}
                    </List>
                </Box>
            </Modal>
            <Button
                sx={{
                    backgroundColor: '#FAF9F6', color: '#0C0C0C', mt: 1, '&:hover': {
                        backgroundColor: '#E1D9D1', color: '#0C0C0C',
                    }, width: '200px'
                }}
                onClick={handlePredictionRedemption}
            >
                Redeem Predictions
            </Button>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography
                    sx={{
                        mt: 3, ml: 1, mr: 1, fontSize: 12, color: '#FAF9F6'
                    }}
                >
                    How are the points calculated?
                </Typography>
                <IconButton onClick={handleInfoOpen}>
                    <InfoIcon sx={{color: '#FAF9F6', mt: 3, ml: 1, mr: 1}}/>
                </IconButton>
            </Box>
            <Modal
                open={infoOpen}
                onClose={handleInfoClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        How to Earn PuckPoints
                    </Typography>
                    <List dense sx={{overflow: 'auto', position: 'relative', maxHeight: '300px'}}>
                        <ListItem>
                            <ListItemText>Predict home score correctly (+5)</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>Predict away score correctly (+5)</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>Predict both scores correctly (bonus +10)</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>Predict winner in any fashion (+5)</ListItemText>
                        </ListItem>
                    </List>
                </Box>
            </Modal>
        </Stack>);
    }
};

export default Profile;