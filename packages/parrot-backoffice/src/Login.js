import {Button, Form, Toast} from 'react-bootstrap';
import './Login.css';
import {useState} from 'react';
import {RequestManager} from '@parrot/requester-manager';

const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [validations, setValidations] = useState([]);

    const validateForm = () => {
        return username.length > 0 && password.length > 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requester = new RequestManager(props.host);
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

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
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
                <Button size="lg" type="submit" disabled={!validateForm()}>
                    Iniciar sesión
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
};

export default Login;
