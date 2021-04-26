import React, {useContext} from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {OnboardingContext} from "./OnboardingContext";
import {useSessionStorage} from "../../../utils";
import OnboardingControls from "./OnboardingControls";
import gql from 'graphql-tag';
import {useMutation} from "@apollo/client";

const useStyles = makeStyles((theme) => ({
    Text: {
        marginTop: '65px',
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: 'center',
        marginTop: '50px',
    },
}));

const CREAT_BIZ_INFO = gql`
mutation CreateBusiness($name: String, $phone: String, $email: String, $address: String) {
  createBusiness(name: $name, phone: $phone, email: $email, address: $address) {
    business {
      id
      name
      phone
      email
      address
    }
  }
}
`

const BusinessInfo = ({step}) => {
    const classes = useStyles();
    const {setImportState} = useContext(OnboardingContext);
    // TODO: handle updating biz info if the user goes back a page. Need to fetch the biz id then add to mutation var
    const [
        createBusinessInfo,
        createBusinessInfoResponse,
    ] = useMutation(CREAT_BIZ_INFO, {
        onCompleted: (data) => {
            console.log(data);
        }
    });

    const [bizName, setBizName] = useSessionStorage('bizName', '');
    const [bizPhone, setBizPhone] = useSessionStorage('bizPhone', '');
    const [bizEmail, setBizEmail] = useSessionStorage('bizEmail', '');
    const [bizAddress, setBizAddress] = useSessionStorage('bizAddress', '');

    const handleFieldChange = (setValue, key) => e => {
        const newValue = e.target.value;
        if (newValue) {
            setImportState((prevState) => ({
                ...prevState,
                [step]: {
                    ...prevState[step],
                    [key]: newValue,
                }
            }));
            setValue(e.target.value);
        }
    }

    const handleError = (value, key) => {
        if (typeof value !== 'string') return true;
        if (key === 'name' || key === 'address' || key === 'email') return false;
        const isValid = ({
            phone: val => val.match(/[a-zA-Z][^#&<>"~;$^%{}?]+$/u),
        }[key]);
        return isValid(value);
    }

    const handleSubmit = () => {
        createBusinessInfo({
            variables: {
                name: bizName,
                phone: bizPhone,
                email: bizEmail,
                address: bizAddress,
            }
        });
    }

    return (
        <Container>
            <Box className={classes.Text}>
                <Typography variant='h3'>Business Information</Typography>
                <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                    <Typography variant='p'>
                        Please input the following business info, these would
                        show up in payment receipt printouts:
                    </Typography>
                </Box>
            </Box>
            <form style={{ width: 500, margin: 'auto' }} autoComplete='off'>
                <TextField
                    style={{marginTop: 25}}
                    fullWidth
                    id='name'
                    label='Business Name'
                    value={bizName}
                    onChange={handleFieldChange(setBizName, "name")}
                    error={handleError(bizName, "name")}
                    required
                />{' '}
                <br/>
                <TextField
                    style={{marginTop: 25}}
                    fullWidth
                    id='phone'
                    label='Business Phone'
                    value={bizPhone}
                    onChange={handleFieldChange(setBizPhone, "phone")}
                    error={handleError(bizPhone, "phone")}
                    required
                />
                <br/>
                <TextField
                    style={{marginTop: 25}}
                    fullWidth
                    id='email'
                    label='Business Email'
                    value={bizEmail}
                    onChange={handleFieldChange(setBizEmail, "email")}
                    error={handleError(bizEmail, "email")}
                    required
                />
                <br/>
                <TextField
                    style={{marginTop: 25}}
                    fullWidth
                    id='address'
                    label='Business Address'
                    value={bizAddress}
                    onChange={handleFieldChange(setBizAddress, "address")}
                    error={handleError(bizAddress, "address")}
                    required
                />
                <br/>
                <OnboardingControls
                    preNextHandler={handleSubmit}
                />
            </form>
        </Container>
    );
};

export default BusinessInfo;
