import { Injectable } from '@nestjs/common';
var emojiStrip = require('emoji-strip')
const keywordExtractor: any = require('keyword-extractor');

@Injectable()
export class TextEnchancerService {
    private unwantedSubstrings = ['/n', '&gt;', '&amp;']
    private extensionSetup = {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false,
    };
    removeUnwantedSubstrings(textBody: string): string {
        textBody = this.removeEmojis(textBody);
        for (const unwantedSubstring of this.unwantedSubstrings) {
            const regexEpression = new RegExp(unwantedSubstring, 'g');
            textBody.replace(regexEpression, '');
        }
        return textBody;
    }

    removeEmojis(textBody: string): string {
         return emojiStrip(textBody);
    }

    async extractKeyWords(textBody: string): Promise<[]> {
        const extractionResult = await keywordExtractor.extract(textBody, this.extensionSetup);
        return extractionResult;
    }
}
