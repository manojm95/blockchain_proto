const sha256 = require("sha256");
const uuid = require("uuid/v1");
// class BlockChain1 {
//   constructor() {
//     this.chain = [];
//     this.pendingTransactions = [];
//   }

//   ....methods here
// }
const currentNodeUrl = process.argv[3];

function BlockChain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.createNewBlock(100, "0", "0");
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
}

BlockChain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

BlockChain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

BlockChain.prototype.createNewTransaction = function(amount, sender, receiver) {
  //see notes for old structure. Adding unque id to the transaction
  const newTransaction = {
    amount: amount,
    sender: sender,
    receiver: receiver,
    transactionId: uuid()
      .split("-")
      .join("")
  };
  return newTransaction;
};

BlockChain.prototype.addTransactionToPendingTransactions = function(
  transactionObject
) {
  // let y = {
  //     name: 'manoj'
  // }

  //console.log(y['name']); ----> manoj
  this.pendingTransactions.push(transactionObject);
  return this.getLastBlock()["index"] + 1;
};

BlockChain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockData,
  nonce
) {
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

BlockChain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substr(0, 5) !== "00000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
};

BlockChain.prototype.isValid = function(blockChain) {
  let isValid = true;
  for (i = 1; i < blockChain.length; i++) {
    let currentBlock = blockChain[i];
    let prevBlock = blockChain[i - 1];
    let blockHash = this.hashBlock(
      prevBlock["hash"],
      {
        transactions: currentBlock["transactions"],
        index: currentBlock["index"]
      },
      currentBlock["nonce"]
    );
    if (blockHash.substr(0, 5) !== "00000") isValid = false;
    if (currentBlock["previousBlockHash"] !== prevBlock["hash"])
      isValid = false;
  }

  const genesisBlock = blockChain[0];
  if (
    genesisBlock["hash"] !== "0" ||
    genesisBlock["previousBlockHash"] !== "0" ||
    genesisBlock["nonce"] !== 100 ||
    genesisBlock["transactions"].length > 0
  )
    isValid = false;

  return isValid;
};

BlockChain.prototype.getBlock = function(blockHash) {
  let correctBlock = null;
  this.chain.forEach(block => {
    if(block.hash === blockHash) {
      correctBlock = block; 
    }
  })
  return correctBlock;
}

BlockChain.prototype.getTransaction = function(transactionId) {
  let correctTransaction = null;
    let correctBlock = null;

  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if(transaction.transactionId === transactionId) {
          correctBlock = block;
          correctTransaction = transaction;
      }
    })
  })
  return { correctBlock, correctTransaction }
}

BlockChain.prototype.getAddressData = function(address) {
  const addressTransactions = [];
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if(transaction.sender === address || transaction.receiver === address) {
          addressTransactions.push(transaction);
      }
    })
  })
  let balance=0;
  addressTransactions.forEach(transaction => {
    if(transaction.sender === address) balance +=transaction.amount;
    else if(transaction.receiver === address) balance -=transaction.amount;
  })

  return {
    addressTransactions: addressTransactions,
    addressBalance: balance
  }

}



module.exports = BlockChain;
