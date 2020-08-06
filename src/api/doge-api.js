const doge = require('../doge');
const sochain = require('../sochain');

exports.generateAddress = (req, res) => {
    res.status(201).json(doge.generateAddress());
};

exports.send = async (req, res) => {
    let wif = req.body.wif;
    let to = req.body.to;
    let amount = req.body.amount;
    let fee = req.body.fee;

    let raw = '';
    try {
        let trx = await doge.newTransaction(wif, to, amount, fee);
        raw = trx.serialize({disableLargeFees: true});
    } catch (e) {
        let message = 'belum berhasil. saldo kamu atau biaya jaringan tidak cukup'
        return res.status(400).json(message);
    }

    try {
        let txid = await sochain.broadcast('doge', raw);
        return res.status(202).json(txid);
    } catch (e) {
        return res.status(400).json('gagal mengirim transaksi');
    }
};
