import { BinaryLike, createHash } from "crypto";

export const hash = (data: BinaryLike): string => createHash("sha256").update(JSON.stringify(data)).digest("hex")

export const validatedHash = ({ hash, difficulty = 4, prefix = "0" }: { hash: string, difficulty: number, prefix: string }) => {
    const check = prefix.repeat(difficulty)
    return hash.startsWith(check)
 }