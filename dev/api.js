var express = require('express')
var bodyparser = require('body-parser');
var app = express();
let Blockchain = require('./blockchain');
const uuid = require('uuid/v1');

const nodeAddress = uuid().split('-').join('');   

const ether = new Blockchain();

//without body-parser the system will not understand body in post requests
//we run the incoming request through below two lines before it reaches actual functions
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
 
//GET THE COMPLETE BLOCKCHAIN 
app.get('/blockchain', function (req, res) {
  res.send(ether);
});

app.post('/transaction', function (req, res) {
  console.log(req.body);
  const {amount, sender, recipient } = req.body;
  let newBlock = ether.createNewTransaction(amount, sender, recipient);
  res.send(`The transaction will be added to block ${newBlock}.`);
});

app.get('/mine', function (req, res) {
    const lastblock = ether.getLastBlock();
        console.log('lastbh111', lastblock);

    const lastblockHash = lastblock['hash'];
    console.log('lastbh', lastblockHash);

    const currentBlockData =    {
        transactions: ether.pendingTransactions,
        index : lastblock['index'] + 1
    }

    const nonce = ether.proofOfWork(lastblockHash, currentBlockData);

    const blockhash = ether.hashBlock(lastblockHash, currentBlockData, nonce);
    ether.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = ether.createNewBlock(nonce, lastblockHash, blockhash);
    res.json({
        note: "New block created successfully",
        block: newBlock
    })
    
});
 
app.listen(3000,()=>{
    console.log('Listening on port 3000...')
});