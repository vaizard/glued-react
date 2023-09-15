import { Base64 } from 'js-base64';


export default class Printer {
    _url;
    _printUrl;
    _onPrintQueueChange;
    _queue = [];

    constructor(url, printUrl, onPrintQueueChange) {
        this._printUrl = printUrl;
        this._url = new URL(url);
        this._onPrintQueueChange = onPrintQueueChange || (() => {});
    }



    print = async (template, data, metadata) => {

        let printData = {
            metadata: metadata,
            blob: null,
            jobId: Math.floor(Math.random() * 1000000)
        };


        this._queue.push(printData);
        this.causeUpdate();

        printData.blob = await this.generate(template, data)


        let form = new FormData();
        form.append("file", printData.blob, "file.pdf");
        if (metadata?.config) {
            form.append("config", metadata?.config);
        }

        await fetch(this._printUrl, {
            method: 'POST',
            body: form
        });

        this.causeUpdate();

    };


    /**
     * Creates a PDF blob
     * @returns {Promise<Blob>}
     */
    generate = async (template, data) => {
        const response = await fetch(this.getUrl(template, data))
        return await response.blob()
    }

    getUrl = (template, items) => {
        let json = JSON.stringify(items.length === 1 ? items[0] : items);
        let base64 = Base64.encode(json);

        const url = new URL(this._url)
        url.pathname = appendPath(url.pathname, [template, base64])

        return url;
    };

    causeUpdate() {
        this._onPrintQueueChange(this._queue)
    }
}


export function appendPath(original, pathParts) {
    while(original.endsWith("/")) {
        original = original.slice(0, -1)
    }
    return [original, ...pathParts].join("/")
}