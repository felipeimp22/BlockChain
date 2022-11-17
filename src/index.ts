import {Blockchain} from './blockchain'


const difficulty = Number(process.argv[2]) || 4
const blockchain = new Blockchain(difficulty)

const numBlocks = Number(process.argv[3]) || 10
let chain = blockchain.chain

for( let i = 1; i<= numBlocks; i ++){
const block =  blockchain.createBlock(`Block ${i}`)
//minerando o bloco, vai encontrar o nounce
const mineInfo =  blockchain.mineBlock(block)

chain = blockchain.pushBlock(mineInfo.minedBlock)
}

console.log('\n ------------------------- \n ************ BLOCKCHAIN ************ \n \n -------------------------\n')
console.log('\n***********',chain,'***********\n')