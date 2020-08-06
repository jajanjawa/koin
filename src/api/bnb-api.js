const {BncClient} = require('@binance-chain/javascript-sdk');
const api = 'https://dex-asiapacific.binance.org';
const client = new BncClient(api);

client.chooseNetwork("mainnet");

exports.generateAddress = async (req, res) => {
    let account = client.createAccount();
    return res.status(201).json(account);
};

exports.generateKeystore = (req, res) => {
    let pass = req.body.pass;
    if (!pass) {
        return res.status(400).json("perlu sandi");
    }

    let result = client.createAccountWithKeystore(pass);
    res.status(201).json(result.keystore);
};

exports.unlockKeystore = (req, res) => {
    let pass = req.body.pass;
    let store = req.body.store;
    if (!pass) {
        return res.status(400).json('perlu sandi');
    }
    if (!store) {
        return res.status(400).json('perlu keystore');
    }

    try {
        let result = client.recoverAccountFromKeystore(store, pass);
        res.status(202).json(result);
    } catch (e) {
        res.status(400).json('sandi salah');
    }
};


exports.send = async (req, res) => {
    let body = req.body;
    let privateKey = body.wif;
    let to = body.to;
    let asset = body.asset || 'BNB';
    let amount = body.amount;
    let memo = body.memo || '';

    try {
        await client.initChain();
        await client.setPrivateKey(privateKey);
        let sender = client.getClientKeyAddress();

        let result = await client.transfer(sender, to, amount, asset, memo);
        return res.status(202).json(result);
    } catch (e) {
        return res.status(400).json('belum berhasil');
    }
};

exports.multiSend = async (req, res) => {
    let body = req.body;
    let privateKey = body.wif;
    let outputs = body.outputs || [];

    try {
        await client.initChain();
        await client.setPrivateKey(privateKey);
        let sender = client.getClientKeyAddress();

        let result = await client.multiSend(sender, outputs);
        return res.status(202).json(result);
    } catch (e) {
        return res.status(400).json('belum berhasil');
    }
};
