import {useHistory} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {useContext} from 'react';

export const Home = (props) => {

    const {context} = props;

    const history = useHistory();
    const auth = useContext(context);

    return (<div>
        <h3>Protected</h3>

        <Button onClick={() => {
            auth.signout(() => history.push('/login'));
        }}>Cerrar sesión</Button>
    </div>);
};
