import {useHistory} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {useContext, useEffect, useState} from 'react';
import {RequestManager} from '@parrot/requester-manager';
import {useSelector} from 'react-redux';
import {selectUser} from '../reducers/user';

export const Home = ({context}) => {
    const history = useHistory();
    const auth = useContext(context);
    const [user] = useState(useSelector(selectUser));
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const requester = new RequestManager('http://api-staging.parrot.rest');
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

    const getProducts = async (event) => {
        const uuid = event.target.dataset.uuid;
        const requester = new RequestManager('http://api-staging.parrot.rest');
        const {status, results} = await requester.request({
            endpoint: `api/v1/products/?store=${uuid}`,
            headers: {
                'Authorization': `Bearer ${user?.access_token}`
            }
        });
        if (status === 'ok') {
            setProducts(results);
        }
    };

    return (<div>
        {stores && stores.stores && stores.stores.map(store => (
            <div key={store.uuid}>
                <h3>{store.name}</h3>
                <Button onClick={getProducts} data-uuid={store.uuid}>Ver productos</Button>
                <Button onClick={() => {setProducts([])}}>Cerrar productos</Button>
                <hr/>
                <div className="products">
                    {products && products.length > 0 && products.map(product => (<div className="product-item" key={product.uuid}>
                        <p>{product.name}</p>
                        <p>{product.description}</p>
                        <p>{product.price}</p>
                    </div>))}
                </div>
            </div>
        ))}

        <Button onClick={() => {
            auth.signout(() => history.push('/login'));
        }}>Cerrar sesión</Button>
    </div>);
};
