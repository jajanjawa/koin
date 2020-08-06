const axios = require('axios');
const sochain = 'https://sochain.com';

exports.unspent = async (network, address) => {
    let path = `${sochain}/api/v2/get_tx_unspent/${network}/${address}`;
    try {
        let response = await axios.get(path);
        let result = response.data;
        let utxo = result.data.txs;
        utxo.sort((a, b) => {
            return b.value - a.value;
        });
        return utxo;
    } catch (e) {
        throw e;
    }
};

exports.broadcast = async (network, message) => {
    let url = `${sochain}/api/v2/send_tx/${network}`;
    try {
        let response = await axios.post(url, {tx_hex: message});
        return response.data.data.txid;
    } catch (e) {
        throw e;
    }
};
