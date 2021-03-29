import { makeStyles } from '@material-ui/core/styles';

const useAuthStyles = makeStyles((theme) => ({
    header: {
        'font-family': "'Roboto Slab', serif",
        'font-size': '36px',
        'font-style': 'normal',
        'font-weight': 'bold',
        'line-height': '47px',
    },
    primaryButton: {
        color: 'white',
        'margin-top': '20px',
    },
    root: {
        height: '400px',
        left: '50%',
        padding: '37px',
        position: 'fixed',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        [theme.breakpoints.up('sm')]: {
            padding: '55px',
            width: '533px',
        },
        [theme.breakpoints.down('xs')]: {
            'box-shadow': 'none',
            'margin-top': '6vh',
            padding: '10px',
            width: '80vw',
        },
    },
    secondaryButton: {
        'margin-top': '20px',
    },
}));

export default useAuthStyles;
