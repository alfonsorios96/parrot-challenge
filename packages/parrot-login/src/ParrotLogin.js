import {useSelector} from 'react-redux';

const ParrotLogin = () => {

    const user = useSelector(state => state.user.value);
    return <h2>Login - ${user?.access_token ? user.access_token : ''}</h2>;
};

export default ParrotLogin;
