const dogecore = require('litecore-lib');
const sochain = require('./sochain');

dogecore.Networks.add({
        name: 'doge',
        alias: 'doge',
        pubkeyhash: 0x1e,
        privatekey: 0x9e,
        scripthash: 0x16,
        xpubkey: 0x02facafd,
        xprivkey: 0x02fac398,
        networkMagic: 0xc0c0c0c0,
        port: 22556,
        dnsSeeds: [
            'seed.dogecoin.com',
            'seed.multidoge.org',
            'seed2.multidoge.org',
            'seed.doger.dogecoin.com'
        ]
    }
);

exports.generateAddress = () => {
    let key = dogecore.PrivateKey.fromRandom('doge');
    return {
        address: key.toAddress().toString(),
        wif: key.toWIF()
    }
}

exports.newTransaction = async (privateKey, to, amount, fee) => {
    let pKey = new dogecore.PrivateKey(privateKey, 'doge');
    let sender = pKey.toAddress().toString();

    let utxo = await sochain.unspent('doge', sender);
    if (utxo.length === 0) throw new Error('silahkan isi saldo dahulu');

    let trx = new dogecore.Transaction();
    trx.change(sender);
    trx.to(to, amount * 1e8);
    if (fee) trx.fee(fee * 1e8);
    for (let it of utxo) {
        trx.from({
                txId: it.txid,
                outputIndex: it.output_no,
                script: it.script_hex,
                satoshis: it.value * 1e8
            }
        );
        if (trx.getChangeOutput()) break; // saldo sudah cukup. tidak ditambahkan semua
    }
    return trx.sign(pKey);
};
