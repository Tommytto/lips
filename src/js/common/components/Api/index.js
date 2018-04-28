class Api {
    constructor(url, method, data, options) {
        this.url = url;
        this.method = method;
        this.data = data;
        this.options = {
            method,
            body: data,
            ...options,
        };
    }

    async send() {
        const response = await fetch(this.url, this.options);
        return {
            data: await response.json(),
            status: response.status,
        }
    }
}

export {
    Api,
}