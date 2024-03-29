"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

/**
 * @param blob
 * @param readAs
 * @returns Promise<ArrayBuffer>
 */
var blobToBufferOrString = function (blob, readAs) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        /**
         * @param event
         */
        var loadedCb = function (event) {
            var buf = event.target.result;
            reader.removeEventListener('loadend', loadedCb);
            resolve(readAs !== 'string' ? new Uint8Array(buf) : buf);
        };
        var errorCb = function () {
            reader.removeEventListener('error', errorCb);
            reject(new Error("toWebVTT: Error while reading the Blob object"));
        };
        reader.addEventListener('loadend', loadedCb);
        reader.addEventListener('error', errorCb);
        if (readAs !== 'string') {
            reader.readAsArrayBuffer(blob);
        }
        else {
            reader.readAsText(blob);
        }
    });
};
/**
 * @param text
 * @returns ObjectURL
 */
var blobToURL = function (text) { return URL
    .createObjectURL(new Blob([text], { type: 'text/vtt' })); };
/**
 * @param utf8str
 * @returns string
 */
var toVTT = function (utf8str) { return utf8str
    .replace(/\{\\([ibu])\}/g, '</$1>')
    .replace(/\{\\([ibu])1\}/g, '<$1>')
    .replace(/\{([ibu])\}/g, '<$1>')
    .replace(/\{\/([ibu])\}/g, '</$1>')
    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
    .concat('\r\n\r\n'); };
/**
 * @param resource
 * @returns Promise<string>
 */
var toWebVTT = function (resource) { return __awaiter(void 0, void 0, void 0, function () {
    var text, vttString, buffer, e_1, buffer, decode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(FileReader)) {
                    throw (new Error("toWebVTT: No FileReader constructor found"));
                }
                if (!TextDecoder) {
                    throw (new Error("toWebVTT: No TextDecoder constructor found"));
                }
                if (!(resource instanceof Blob)) {
                    throw new Error("toWebVTT: Expecting resource to be a Blob but something else found.");
                }
                vttString = 'WEBVTT FILE\r\n\r\n';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 5]);
                return [4 /*yield*/, blobToBufferOrString(resource, 'string')];
            case 2:
                buffer = _a.sent();
                text = vttString.concat(toVTT(buffer));
                return [3 /*break*/, 5];
            case 3:
                e_1 = _a.sent();
                return [4 /*yield*/, blobToBufferOrString(resource, 'buffer')];
            case 4:
                buffer = _a.sent();
                decode = new TextDecoder('utf-8').decode(buffer);
                text = vttString.concat(toVTT(decode));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, Promise.resolve(blobToURL(text))];
        }
    });
}); };
