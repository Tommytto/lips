import {Api} from "../common/components/Api";

const selectors = {
    form: '#login-form',
    helpBlock: '.j-help',
};

document.addEventListener("DOMContentLoaded", function(event) {
    document
        .querySelector(selectors.form)
        .addEventListener('submit', async (event) => {
            event.preventDefault();
            const target = event.currentTarget;
            const inputList = target.querySelectorAll('input');
            const formData = {};

            inputList.forEach((item) => {
                formData[item.name] = item.value;
            });

            const loginApi = new Api('/auth/login', 'POST', JSON.stringify(formData), {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const {data} = await loginApi.send();
            if (data.error) {
                const helpBlock = document.querySelector(selectors.helpBlock);
                helpBlock.innerText = data.error;
            }
            if (data.token) {
                localStorage.setItem('token', data.token);
                document.cookie = `authorization=${data.token};path=/`;
            }
        })
});