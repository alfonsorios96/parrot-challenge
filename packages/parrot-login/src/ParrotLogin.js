import {useContext, useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {RequestManager} from '@parrot/requester-manager';
import {Button, Form, Toast} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {saveSession, toggleSpinner} from '@parrot/store';

import './ParrotLogin.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const ParrotLogin = ({context, host}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useContext(context);
    const location = useLocation();
    const {from} = location.state || {from: {pathname: '/protected'}};

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [validations, setValidations] = useState([]);

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token') || '';
        if (access_token !== '') {
            const requester = new RequestManager(host);
            requester.request({
                endpoint: 'api/auth/token/test',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                before: () => {
                    dispatch(toggleSpinner(true));
                },
                after: () => {
                    dispatch(toggleSpinner(false));
                }
            }).then(payload => {
                if (payload.status === 'ok') {
                    auth.signin(() => {
                        dispatch(saveSession({
                            access_token: sessionStorage.getItem('access_token'),
                            refresh_token: sessionStorage.getItem('refresh_token')
                        }));
                    });
                    from.pathname = '/home';
                    history.replace(from);
                }
            }).catch(error => {
                history.replace(from);
            });
        }
    }, []);

    const validateForm = () => {
        return EMAIL_REGEX.test(username) && password.length > 0;
    };

    const login = async (event) => {
        event.preventDefault();
        const requester = new RequestManager(host);
        try {
            const {access: access_token, refresh: refresh_token} = await requester.request({
                endpoint: 'api/auth/token',
                method: 'POST',
                body: {
                    username: username,
                    password: password
                },
                callbacks: [
                    {
                        status: 400,
                        action: (error) => {
                            error.json().then(({errors, validation}) => {
                                const _validations = [
                                    ...Object.entries(validation).reduce((_messages, [key, value]) => {
                                        return [..._messages,
                                            ...value.map(message => ({
                                                    field: key,
                                                    error: message.message
                                                })
                                            )];
                                    }, [])
                                ];
                                let showModal = false;
                                if (_validations && _validations.length > 0) {
                                    setValidations(_validations);
                                    showModal = true;
                                }
                                if (errors && errors.length > 0) {
                                    setErrors(errors);
                                    showModal = true;
                                }
                                if (showModal) {
                                    toggleShowModal();
                                }
                            })
                        }
                    },
                    {
                        status: 401,
                        action: (error) => {
                            error.json().then(({errors}) => {
                                setErrors(errors);
                                toggleShowModal();
                            })
                        }
                    }
                ],
                before: () => {
                    dispatch(toggleSpinner(true));
                },
                after: () => {
                    dispatch(toggleSpinner(false));
                }
            });
            if (access_token && access_token !== '' && refresh_token && refresh_token !== '')
                auth.signin(() => {
                    dispatch(saveSession({
                        access_token, refresh_token
                    }));
                    sessionStorage.setItem('access_token', access_token);
                    sessionStorage.setItem('refresh_token', refresh_token);
                    history.replace(from);
                });
        } catch (e) {
            console.log('[ERROR]', e);
        }
    };

    const [showModal, setShowModal] = useState(false);

    const toggleShowModal = () => {
        setTimeout(() => {
            setShowModal(false);
            setValidations([]);
            setErrors([]);
        }, 10000);
        return setShowModal(!showModal);
    };

    const fillDemoData = () => {
        setUsername('android-challenge@parrotsoftware.io');
        setPassword('8mngDhoPcB3ckV7X');
    };

    return (
        <div className="Login">
            <Form onSubmit={login}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={username}
                        placeholder={'Ej. user-client@parrot-challenge.net'}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Contrase??a</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        placeholder={'Ej. 8mngDh3ckV7X345f'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <div className={'button-actions'}>
                    <Button variant={'secondary'} size="md" type="submit" disabled={!validateForm()}>
                        Iniciar sesi??n
                    </Button>
                    <Button size="md" type="button" onClick={fillDemoData}>
                        Llenar datos de prueba
                    </Button>
                </div>
            </Form>

            <Toast show={showModal} onClose={toggleShowModal}>
                <Toast.Header>
                    <strong className="me-auto">Mensajes del sistema</strong>
                </Toast.Header>
                <Toast.Body>
                    {
                        errors && errors.length > 0 && <p>Errores</p>
                    }
                    <ul>
                        {errors && errors.map(error =>
                            <li>{error.message}</li>
                        )}
                    </ul>
                    {
                        validations && validations.length > 0 && <p>Validaciones</p>
                    }
                    <ul>
                        {validations && validations.map(validation =>
                            <li>{validation.field} : {validation.error}</li>
                        )}
                    </ul>
                </Toast.Body>
            </Toast>
        </div>
    );
}

export default ParrotLogin;
