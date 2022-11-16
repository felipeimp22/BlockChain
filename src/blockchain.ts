import { createHash } from "crypto";
import { encode } from "punycode";
import { hash } from "./utils";

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


}