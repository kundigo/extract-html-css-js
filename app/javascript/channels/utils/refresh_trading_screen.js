export default function({ commodity, errorMessage }) {

    const onSuccess = function({ data: { html }  }) {
        const tradingScreen =  document.getElementById('trading-screen');
        tradingScreen.innerHTML = html
    };

    const onError = function(data) {
        console.log(errorMessage);
        console.log(data);
    };

    Api.sendRequest({
        url:`/interests/${commodity}`,
        data: {},
        method: 'GET',
        onSuccess: onSuccess,
        onError: onError,
        delay: false
    });
}
