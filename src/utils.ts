import { BinaryLike, createHash } from "crypto";

export const hash = (data:BinaryLike): string => createHash("sha256").update(JSON.stringify(data)).digest("hex")