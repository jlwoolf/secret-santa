import { adjectives, nouns } from "$lib/data"
import crypto from "node:crypto";

function randomNoRepeats(array: any[]) {
    var copy = array.slice(0);
    return function () {
        if (copy.length < 1) { copy = array.slice(0); }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
}

export const codeGenerator = (config: {
    n_adjectives?: number,
    prefix?: string,
    postfix?: string,
} = {}) => {
    const { n_adjectives = 2, prefix = "", postfix = "" } = config;

    const adjectivePicker = randomNoRepeats(adjectives);
    const nounPicker = randomNoRepeats(nouns)

    const result = [prefix];
    for (let i = 0; i < n_adjectives && i < adjectives.length; i++) {
        result.push(adjectivePicker());
    }
    result.push(nounPicker());
    result.push(postfix);

    return result.filter(v => v).join('-')
}

export const sessionKeyGenerator = (size: number = 512) => {
    return crypto.randomBytes(size).toString('base64url')
}

export default {
    code: codeGenerator,
    sessionKey: sessionKeyGenerator
}