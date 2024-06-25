import { Tokenizer } from "./types";
import { getEncoding, encodingForModel } from "js-tiktoken";

/**
 * Tokenizer that uses GPT-3's encoder.
 */
export class GPT3Tokenizer implements Tokenizer {
    private enc: any;

    public constructor() {
        this.enc = getEncoding("gpt2");
    }
    public decode(tokens: number[]): string {
        return this.enc.decode(tokens);
    }

    public encode(text: string): number[] {
        return this.enc.encode(text);
    }
}
