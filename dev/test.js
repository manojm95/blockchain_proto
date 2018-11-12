const BlockChain = require("./blockchain");

const bitcoin = new BlockChain();

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1542576178783,
      transactions: [],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0"
    },
    {
      index: 2,
      timestamp: 1542576233797,
      transactions: [],
      nonce: 85021,
      hash: "00000533d7b3de42c4051cc52167cd46812b0312bebd30c2a114859eecc6202f",
      previousBlockHash: "0"
    },
    {
      index: 3,
      timestamp: 1542576298484,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          receiver: "1f45c870eb7811e8955e27bb0ae6bb2f",
          transactionId: "400ff2b0eb7811e8955e27bb0ae6bb2f"
        },
        {
          amount: 10,
          sender: "MANOTTTTRRRRRWWWEEWWE",
          receiver: "NIV8TTTTRRRRRWWWEHHHEWWE",
          transactionId: "55b94c10eb7811e891c29387ea8cb717"
        },
        {
          amount: 20,
          sender: "MANOTTTTRRRRRWWWEEWWE",
          receiver: "NIV8TTTTRRRRRWWWEHHHEWWE",
          transactionId: "578b9b10eb7811e891c29387ea8cb717"
        },
        {
          amount: 30,
          sender: "MANOTTTTRRRRRWWWEEWWE",
          receiver: "NIV8TTTTRRRRRWWWEHHHEWWE",
          transactionId: "5b0c0f40eb7811e891c29387ea8cb717"
        }
      ],
      nonce: 1464149,
      hash: "00000addee3c56dee8751e6f5b171effcb4523f52957929b6f4923a0b1a52a18",
      previousBlockHash:
        "00000533d7b3de42c4051cc52167cd46812b0312bebd30c2a114859eecc6202f"
    },
    {
      index: 4,
      timestamp: 1542576336525,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          receiver: "1f45c870eb7811e8955e27bb0ae6bb2f",
          transactionId: "669c91e0eb7811e8955e27bb0ae6bb2f"
        }
      ],
      nonce: 1651337,
      hash: "000008213767902b714d17ea0782bcc13983a464d5c667a29812e8e4ee5aea6f",
      previousBlockHash:
        "00000addee3c56dee8751e6f5b171effcb4523f52957929b6f4923a0b1a52a18"
    },
    {
      index: 5,
      timestamp: 1542576368614,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          receiver: "1f45c870eb7811e8955e27bb0ae6bb2f",
          transactionId: "7d4ad820eb7811e8955e27bb0ae6bb2f"
        },
        {
          amount: 40,
          sender: "MANOTTTTRRRRRWWWEEWWE",
          receiver: "NIV8TTTTRRRRRWWWEHHHEWWE",
          transactionId: "859d46c0eb7811e891c29387ea8cb717"
        },
        {
          amount: 50,
          sender: "MANOTTTTRRRRRWWWEEWWE",
          receiver: "NIV8TTTTRRRRRWWWEHHHEWWE",
          transactionId: "87d61fc0eb7811e891c29387ea8cb717"
        },
        {
          amount: 60,
          sender: "MANOTTTTRRRRRWWWEEWWE",
          receiver: "NIV8TTTTRRRRRWWWEHHHEWWE",
          transactionId: "89f1acc0eb7811e891c29387ea8cb717"
        }
      ],
      nonce: 504492,
      hash: "0000057caaa6c1c2bd32265880198800e4eedcbe58b9bc5f21282b8049dbf10d",
      previousBlockHash:
        "000008213767902b714d17ea0782bcc13983a464d5c667a29812e8e4ee5aea6f"
    },
    {
      index: 6,
      timestamp: 1542576392292,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          receiver: "1f45c870eb7811e8955e27bb0ae6bb2f",
          transactionId: "906919d0eb7811e8955e27bb0ae6bb2f"
        }
      ],
      nonce: 595471,
      hash: "000007b8cd4637788c1197d2bad6d76a4329b4ed90a611bfe94963b72d4680fa",
      previousBlockHash:
        "0000057caaa6c1c2bd32265880198800e4eedcbe58b9bc5f21282b8049dbf10d"
    }
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: "00",
      receiver: "1f45c870eb7811e8955e27bb0ae6bb2f",
      transactionId: "9e8688e0eb7811e8955e27bb0ae6bb2f"
    }
  ],
  currentNodeUrl: "http://localhost:3002",
  networkNodes: [
    "http://localhost:3001",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005"
  ]
};

// bitcoin.createNewBlock(2000,'X034456bbbbbb','X034456bbbbbjjjjb');

// bitcoin.createNewTransaction(100,'MANOXXx55566XXX','NIVEXXXXX566666RRRx');

// bitcoin.createNewBlock(3000,'X034456bbbbbb','X034456bbbbbjjjjb');

// bitcoin.createNewTransaction(200,'MMANOXXx55566XXX','NNIVEXXXXX566666RRRx');
// bitcoin.createNewTransaction(300,'MMMANOXXx55566XXX','NNNIVEXXXXX566666RRRx');
// bitcoin.createNewTransaction(1400,'MMMMANOXXx55566XXX','NNNNIVEXXXXX566666RRRx');

// bitcoin.createNewBlock(4000,'X034456bbbbbb','X034456bbbbbjjjjb');

// console.log(bitcoin);

// console.log(bitcoin.getLastBlock());

// let previousHash = "0XrrrrrFFFFGGDDDDKKKLLLLL";
// let currentBlockData = [
//   {
//     amount: 200,
//     sender: "MMANOXXx55566XXX",
//     receiver: "NNIVEXXXXX566666RRRx"
//   },
//   {
//     amount: 300,
//     sender: "MMMANOXXx55566XXX",
//     receiver: "NNNIVEXXXXX566666RRRx"
//   },
//   {
//     amount: 1400,
//     sender: "MMMMANOXXx55566XXX",
//     receiver: "NNNNIVEXXXXX566666RRRx"
//   }
// ];

//bitcoin.proofOfWork(previousHash,currentBlockData);

//console.log(bitcoin.proofOfWork(previousHash,currentBlockData));

console.log('VALID: ',bitcoin.isValid(bc1.chain));

//console.log(bitcoin.getLastBlock());
