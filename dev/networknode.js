var express = require("express");
var bodyparser = require("body-parser");
var app = express();
let Blockchain = require("./blockchain");
const rp = require("request-promise");
const uuid = require("uuid/v1");
const port = process.argv[2];

const nodeAddress = uuid()
  .split("-")
  .join("");

const ether = new Blockchain();

//without body-parser the system will not understand body in post requests
//we run the incoming request through below two lines before it reaches actual functions
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//GET THE COMPLETE BLOCKCHAIN
app.get("/blockchain", function(req, res) {
  res.send(ether);
});

//adds a transaction to the pendingtransaction array for to be picked for next mining
//old method and obselete after Lec:50
// app.post("/transaction", function(req, res) {
//   console.log(req.body);
//   const { amount, sender, recipient } = req.body;
//   let newBlock = ether.createNewTransaction(amount, sender, recipient);
//   res.send(`The transaction will be added to block ${newBlock}.`);
// });

app.post("/transaction", function(req, res) {
  let newBlockIndex = ether.addTransactionToPendingTransactions(req.body);
  res.send(`The transaction will be added to block ${newBlockIndex}.`);
});

//new transaction posting method and broadcasting
app.post("/transaction/broadcast", function(req, res) {
  const { amount, sender, recipient } = req.body;
  const newTransaction = ether.createNewTransaction(amount, sender, recipient);
  ether.pendingTransactions.push(newTransaction);
  let transactionPromises = [];
  ether.networkNodes.forEach(networkNode => {
    const requestOptions = {
      uri: networkNode + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true
    };
    transactionPromises.push(rp(requestOptions));
  });

  Promise.all(transactionPromises).then(data => {
    //once all promises are resolved control comes here
    res.json({ note: "All transactions completed successfully" });
  });
});

//performs proof of work, determines nonce and mines the block with all pending transactions
app.get("/mine", function(req, res) {
  const lastblock = ether.getLastBlock();
  console.log("lastbh111", lastblock);

  const lastblockHash = lastblock["hash"];
  console.log("lastbh", lastblockHash);

  const currentBlockData = {
    transactions: ether.pendingTransactions,
    index: lastblock["index"] + 1
  };

  const nonce = ether.proofOfWork(lastblockHash, currentBlockData);

  const blockhash = ether.hashBlock(lastblockHash, currentBlockData, nonce);
  //ether.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = ether.createNewBlock(nonce, lastblockHash, blockhash);

  const blockBroadCastRquestArray = [];
  ether.networkNodes.forEach(networkNode => {
    const requestOptions = {
      uri: networkNode + "/receive-new-block",
      method: "POST",
      body: { newBlock },
      json: true
    };
    blockBroadCastRquestArray.push(rp(requestOptions));
  });
  Promise.all(blockBroadCastRquestArray)
    .then(data => {
      const tranOptions = {
        uri: ether.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: { amount: 12.5, sender: "00", recipient: nodeAddress },
        json: true
      };
      return rp(tranOptions);
    })
    .then(data => {
      res.json({
        note: "New block created successfully",
        block: newBlock
      });
    });
});

app.post("/receive-new-block", function(req, res) {
  const { newBlock } = req.body;
  const lastblock = ether.getLastBlock();
  const goodBlockHash = lastblock.hash === newBlock.previousBlockHash;
  const goodBlockIndex = lastblock["index"] + 1 === newBlock["index"];
  if (goodBlockHash && goodBlockIndex) {
    ether.chain.push(newBlock);
    ether.pendingTransactions = [];
    res.json({ note: "New Block Received and Accepted" });
  } else {
    res.json({
      note: "New Block Rejected",
      newBlock: newBlock
    });
  }
});

//registers and notifies a new done. A node request comes only to one node in the n/w. The first
//receiving node will register and notify all other nodes. Other nodes receiving the message will only register it
// and won't again notify other nodes as it will create infinite loop and crash the chain
app.post("/register-and-broadcas-node", function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (ether.networkNodes.indexOf(newNodeUrl) === -1)
    ether.networkNodes.push(newNodeUrl);

  let regNodePromises = [];
  ether.networkNodes.forEach(networkNode => {
    const requestOptions = {
      uri: networkNode + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true
    };
    regNodePromises.push(rp(requestOptions));
  });

  Promise.all(regNodePromises)
    .then(data => {
      const bulgRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...ether.networkNodes, ether.currentNodeUrl]
        },
        json: true
      };
      rp(bulgRegisterOptions);
    })
    .then(data => {
      res.json({ note: "New Node registered Successfuly in the network." });
    });
});

//on receiving notification other nodes will just register and wont broadcast
app.post("/register-node", function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  console.log(newNodeUrl + "KKKKKKK");
  //checking if new already exists and newnodeurl notification is not coming to itself
  if (
    ether.networkNodes.indexOf(newNodeUrl) === -1 &&
    newNodeUrl !== ether.currentNodeUrl
  )
    ether.networkNodes.push(newNodeUrl);
  res.json({ note: "New node registered successfully with node" });
});

//register multiple nodes at once
app.post("/register-nodes-bulk", function(req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    if (
      ether.networkNodes.indexOf(networkNodeUrl) === -1 &&
      networkNodeUrl !== ether.currentNodeUrl
    ) {
      ether.networkNodes.push(networkNodeUrl);
    }
  });
  res.json({
    note: "All nodes are registered successfully inside the new node"
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

app.get("/consensus", function(req, res) {
  const requestPromises = [];
        //console.log('networkNodes--->', ether.networkNodes);
  ether.networkNodes.forEach(networkNode => {
      //console.log('URL--->', networkNode + '/blockchain');
    let requestOptions = {
      uri: networkNode + '/blockchain',
      method: 'GET',
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises)
  .then(blockchains => {
    //console.log('bolckchains', blockchains);
    const currentChainLength = ether.chain.length;
    let maxChainLength = currentChainLength;
    let newlongestBlockChain = null;
    let newPendingTransactions = null;
    blockchains.forEach(blockchain => {
        if(blockchain.chain.length > maxChainLength){
            maxChainLength = blockchain.chain.length;
            newlongestBlockChain = blockchain.chain;
            newPendingTransactions = blockchain.pendingTransactions;
        }
    });
    //console.log('NNNNNEW',newlongestBlockChain);
    //console.log('VALID:',ether.isValid(newlongestBlockChain));
    if(!newlongestBlockChain || (newlongestBlockChain && !ether.isValid(newlongestBlockChain))){
        res.json({
            note: 'The current block chain is good',
            block: ether.chain
        })
    }
    //else if(newlongestBlockChain && ether.isValid(newlongestBlockChain) ){
    else {
            ether.chain = newlongestBlockChain;
            ether.pendingTransactions = newPendingTransactions;
            res.json({
            note: 'This current block chain is replace with below blcok',
            block: newlongestBlockChain
        })
    }
  });
});

app.get('/block/:blockHash', function(req,res){
  const blockHash = req.params.blockHash;
  const matchBlock = ether.getBlock(blockHash);
  res.json({
    block: matchBlock
  })
})

app.get('/transaction/:transactionId', function(req,res){
  const transactionId = req.params.transactionId;
  const matchBlock = ether.getTransaction(transactionId);
  res.json({
    block: matchBlock.correctBlock,
    transaction : matchBlock.correctTransaction
  })
})

app.get('/address/:address', function(req,res){
  const address = req.params.address;
  const matchTransactions = ether.getAddressData(address);
  res.json({
    matchTransactions: matchTransactions.addressTransactions,
    balance : matchTransactions.addressBalance
  })
})

app.get('/block-explorer',  function(req,res){
  res.sendFile('./block-explorer/index.html',{root:__dirname });
})

//OLD MINE
// //performs proof of work, determines nonce and mines the block with all pending transactions
// app.get("/mine", function(req, res) {
//   const lastblock = ether.getLastBlock();
//   console.log("lastbh111", lastblock);

//   const lastblockHash = lastblock["hash"];
//   console.log("lastbh", lastblockHash);

//   const currentBlockData = {
//     transactions: ether.pendingTransactions,
//     index: lastblock["index"] + 1
//   };

//   const nonce = ether.proofOfWork(lastblockHash, currentBlockData);

//   const blockhash = ether.hashBlock(lastblockHash, currentBlockData, nonce);
//   ether.createNewTransaction(12.5, "00", nodeAddress);

//   const newBlock = ether.createNewBlock(nonce, lastblockHash, blockhash);
//   res.json({
//     note: "New block created successfully",
//     block: newBlock
//   });
// });
