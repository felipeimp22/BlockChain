import { createHash } from "crypto";
import { encode } from "punycode";
import { hash, validatedHash } from "./utils";

export interface Block {
    //Header is the metadata of block
    header: {
        nonce: number;
        blockHash: string;
    };
    //all calculations are done from the payload
    payload: {
        sequence: number;
        timestamp: number;
        data: any;
        prevHash: string;
    }
}
//POW = prof of work
export class Blockchain {
    /**
     * attributes and encapsulation.
     *  + = public
     *  - = private
     *  # = protected
     */
    /**
     * Here we can use private like:
     * #chain
     * _chain
     * private chain
     */
    #chain: Block[] = []

    private powPrefix = '0'

    constructor(private readonly difficulty: number = 4) {
        this.#chain.push(this.createGenesisBlock())
    }

    private createGenesisBlock(): Block {
        const payload: Block["payload"] = {
            sequence: 0,
            // "+" plus convert date to number, "timeStamps"
            timestamp: +new Date,
            data: "Genesis",
            prevHash: ""
        }

        return {
            header: {
                nonce: 0,
                blockHash: hash(JSON.stringify(payload))
            },
            payload
        }
    }

    get chain(): Block[] {
        return this.#chain
    }

    private get lastBlock(): Block {
        return this.#chain.at(-1) as Block
      }

    private hashLastBlock(): string {
        return this.lastBlock.header.blockHash
    }

    createBlock(data:any):Block["payload"]{
        const newBlock:Block['payload'] = {
            sequence: this.lastBlock.payload.sequence + 1,
            timestamp: +new Date(),
            data,
            prevHash: this.hashLastBlock()
        }
        console.log({Message: `Block ${newBlock.sequence} created`})
        return newBlock
    }

    mineBlock(block:Block['payload']){
        let nonce: number = 0
        let start: number = +new Date()

        while(true){
            const blockHash: string = hash(JSON.stringify(block))
            const powHash: string = hash(blockHash + nonce)
    
            if(validatedHash({hash:powHash, difficulty:this.difficulty, prefix: this.powPrefix})){
                const final: number = +new Date()
                const reducedHash = blockHash.slice(0,12)
                const miningTime = (final - start)/1000
                console.log(`Block #${block.sequence} mined, time: ${miningTime}s, hash: ${reducedHash}, nonce: ${nonce}`)
    
                return{
                    minedBlock:{
                        payload:{...block},
                        header:{
                            nonce,
                            blockHash
                        }
                    }
                }
            }
            nonce++
        }  
    }

    checkBlock(block:Block): boolean{
        if(block.payload.prevHash !== this.hashLastBlock()){
            console.error(`block #${block.payload.sequence} is invalid. The previous hash correct is ${this.hashLastBlock()} not ${block.payload.prevHash}.`)
            return false
        }

        const hashTest = hash(hash(JSON.stringify(block.payload))+block.header.nonce)
        
        if(!validatedHash({hash:hashTest, difficulty: this.difficulty, prefix: this.powPrefix})){
            console.error(`block #${block.payload.sequence} is invalid. Nonce ${block.header.nonce} is invalid and cannot be verified.`)
            return false
        }

        return true
    }
    pushBlock(block:Block):Block[]{
        if(this.checkBlock(block)){ 
            this.#chain.push(block)
            console.log(`The block #${block.payload.sequence} has been added to Blockchain:
            ${JSON.stringify(block,null,2)}`)
        }
        return this.#chain
    }


}