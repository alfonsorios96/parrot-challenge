import {useHistory} from 'react-router-dom';
import {Button, Accordion, Form} from 'react-bootstrap';
import {useContext, useEffect, useState} from 'react';
import {RequestManager} from '@parrot/requester-manager';
import {useSelector} from 'react-redux';
import {selectUser} from '../reducers/user';

import './Home.css';

export const Home = ({context, host}) => {
    const history = useHistory();
    const auth = useContext(context);
    const [user] = useState(useSelector(selectUser));
    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const requester = new RequestManager(host);
        requester.request({
            endpoint: 'api/v1/users/me',
            headers: {
                'Authorization': `Bearer ${user?.access_token}`
            }
        }).then(({status, result}) => {
            if (status === 'ok') {
                setStores(result);
            }
        }).catch(error => {
            // TODO Handle Error
        });
        return function cleanup() {
            // TODO Clean listeners
        };
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
        } else {
            // If not changed
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
        {stores && stores.stores && stores.stores.map(store => (
            <div key={store.uuid}>
                <h3>{store.name}</h3>
                <Button onClick={getProducts} data-uuid={store.uuid}>Ver productos</Button>
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
            </div>
        ))}
    </div>);
};
