export class RequestManager {
    constructor(host) {
        this.host = host || '';
    }

    async request(config) {
        const params = {};

        const host = config.host || this.host;
        const endpoint = config.endpoint;
        const method = config.method || 'GET';
        params.method = method;
        let body = '{}';
        let headers = {
            'Content-Type': 'application/json'
        };
        if (config.headers && Object.keys(config.headers).length > 0) {
            headers = {...headers, ...config.headers};
        }
        params.headers = headers;
        if (method === 'POST' || method === 'PUT') {
            body = JSON.stringify(config.body);
            params.body = body;
        }
        if(config.before && typeof config.before === 'function') {
            config.before();
        }
        const response = await fetch(`${host}/${endpoint}`, params);
        if (config.callbacks && config.callbacks.length > 0) {
            for (const callback of config.callbacks) {
                if (response.status === callback.status) {
                    callback.action(response);
                }
            }
        }
        if(config.after && typeof config.after === 'function') {
            config.after();
        }
        return await response.json();
    }
}
