import {useHistory} from 'react-router-dom';
import {Button, Accordion, Form} from 'react-bootstrap';
import {useContext, useState} from 'react';
import {RequestManager} from '@parrot/requester-manager';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, toggleSpinner} from '@parrot/store';

import './Home.scss';

const ParrotHome = ({context, host}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useContext(context);
    const [user] = useState(useSelector(selectUser));
    const [categories, setCategories] = useState([]);
    const [_store] = useState({
        "uuid": "e7f46731-1654-4ba3-be83-408ac5255838",
        "name": "Store Android Challenge",
        "availabilityState": "OPEN",
        "providers": [],
        "config": {
            "brandColor": "#FF0000"
        }
    });

    const parseCategories = (products) => {
        return products.reduce((categories, product) => {
            if (categories.some(category => category.uuid === product.category.uuid)) {
                const categoryPosition = categories.findIndex(category => category.uuid === product.category.uuid);
                categories[categoryPosition].products.push({...product, category: null});
            } else {
                categories.push({
                    ...product.category,
                    products: [{...product, category: null}]
                });
            }
            return categories;
        }, []);
    };

    const getProducts = async (event) => {
        const uuid = event.target.dataset.uuid;
        const requester = new RequestManager(host);
        const {status, results} = await requester.request({
            endpoint: `api/v1/products/?store=${uuid}`,
            headers: {
                'Authorization': `Bearer ${user?.access_token}`
            },
            before: () => {
                dispatch(toggleSpinner(true));
            },
            after: () => {
                dispatch(toggleSpinner(false));
            }
        });
        if (status === 'ok') {
            setCategories(parseCategories(results));
        }
    };

    const changeProductState = async (event) => {
        const uuid = event.target.getAttribute('id').replace('switch-', '');
        const requester = new RequestManager(host);
        const {status, result} = await requester.request({
            endpoint: `api/v1/products/${uuid}/availability`,
            method: 'PUT',
            headers: {'Authorization': `Bearer ${user?.access_token}`},
            body: {
                availability: event.target.checked ? 'AVAILABLE' : 'UNAVAILABLE'
            },
            before: () => {
                dispatch(toggleSpinner(true));
            },
            after: () => {
                dispatch(toggleSpinner(false));
            }
        });
        if (status === 'ok') {
            setCategories(categories.map(category => {
                const productIndex = category.products.findIndex(product => product.uuid === uuid);
                if (productIndex !== -1) {
                    category.products[productIndex].availability = result.availability;
                }
                return category;
            }));
        }
    };

    const categoryElement = products => (<div className="categoryItem">
        {products && products.length > 0 && products.map(product => (<div className="productItem" key={product.uuid}>
            <div className="image">
                <img src={product.imageUrl} alt={product.name}/>
            </div>
            <div className="description">
                <p>{product.name}</p>
                <p>{product.price}</p>
            </div>
            <div className="actions">
                <Form>
                    <Form.Check
                        type="switch"
                        id={`switch-${product.uuid}`}
                        checked={product.availability === 'AVAILABLE'}
                        onChange={changeProductState}
                    />
                </Form>
            </div>
        </div>))}
    </div>);

    return (<div>
        <h3>{_store.name}</h3>
        <Button onClick={getProducts} data-uuid={_store.uuid}>Ver productos</Button>
        <Button onClick={() => {
            auth.signout(() => history.push('/login'));
        }}>Cerrar sesión</Button>
        <hr/>
        <div className="products">
            {categories && categories.length > 0 && categories.map((category, categoryIndex) => (
                <div className="product-item" key={category.uuid}>
                    <Accordion defaultActiveKey="0" flush>
                        <Accordion.Item eventKey={`${categoryIndex}`}>
                            <Accordion.Header>{category.name}</Accordion.Header>
                            <Accordion.Body>
                                {categoryElement(category.products)}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>))}
        </div>
    </div>);
}

export default ParrotHome;
