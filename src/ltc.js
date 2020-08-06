const litecore = require('litecore-lib');
const sochain = require('./sochain');

exports.generateAddress = () => {
    let key = new litecore.PrivateKey();
    return {
        address: key.toAddress().toString(),
        wif: key.toWIF()
    }
}

exports.newTransaction = async (privateKey, to, amount, fee) => {
    let pKey = new litecore.PrivateKey(privateKey);
    let sender = pKey.toAddress().toString();

    let utxo = await sochain.unspent('ltc', sender);
    if (utxo.length === 0) throw new Error('silahkan isi saldo dahulu');

    let trx = new litecore.Transaction();
    trx.change(sender);
    trx.to(to, amount * 1e8);
    if (fee > 0) trx.fee(fee * 1e8);
    for (let it of utxo) {
        trx.from({
                txId: it.txid,
                outputIndex: it.output_no,
                script: it.script_hex,
                satoshis: it.value * 1e8
            }
        );
        if (trx.getChangeOutput()) break;
    }
    return trx.sign(pKey);
}
