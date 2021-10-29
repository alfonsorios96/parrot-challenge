import {useContext, useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {RequestManager} from '@parrot/requester-manager';
import {Button, Form, Toast} from 'react-bootstrap';

export const Login = ({context}) => {
    const history = useHistory();
    const auth = useContext(context);
    const location = useLocation();
    const {from} = location.state || {from: {pathname: "/"}};

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [validations, setValidations] = useState([]);

    const validateForm = () => {
        return username.length > 0 && password.length > 0;
    };

    const login = async (event) => {
        event.preventDefault();
        const requester = new RequestManager('http://api-staging.parrot.rest');
        try {
            const response = await requester.request({
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
                ]
            });
            if (response.access && response.access !== '') {
                sessionStorage.setItem('access_token', response.access);
            }
            if (response.refresh && response.refresh !== '') {
                sessionStorage.setItem('refresh_token', response.refresh);
            }
            auth.signin(() => {
                history.replace(from);
            });
        } catch (e) {
            console.log('[ERROR]', e);
        }
    };

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token') || '';
        // const refresh_token = sessionStorage.getItem('refresh_token') || '';
        if (access_token !== '') {
            const requester = new RequestManager('http://api-staging.parrot.rest');
            requester.request({
                endpoint: 'api/auth/token/test',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(payload => {
                if (payload.status === 'ok') {
                    auth.signin(() => {
                        history.replace(from);
                    });
                }
            }).catch(error => {
                // TODO Handle error
            }).finally(() => {
                // TODO Finally
            })
        }
    });

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
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button size="md" type="submit" disabled={!validateForm()}>
                    Iniciar sesión
                </Button>
                <Button size="md" type="button" onClick={fillDemoData}>
                    Llenar datos de prueba
                </Button>
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
