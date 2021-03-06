import * as path from 'path'
import * as fs from 'fs'
export default (function () {
    const CH_PERIOD = 46
    const baseUrl = process.cwd();
    const existsCache: { [index: string]: string; } = {};
    const moduleProto = Object.getPrototypeOf(module);
    const origRequire = moduleProto.require;
    moduleProto.require = function (request: string) {
        let existsPath = existsCache[request];
        if (existsPath === undefined) {
            existsPath = '';
            if (!path.isAbsolute(request) && request.charCodeAt(0) !== CH_PERIOD) {
                const ext = path.extname(request);
                const basedRequest = path.join(baseUrl, ext ? request : request + '.js');
                if (fs.existsSync(basedRequest))
                    existsPath = basedRequest;
                else {
                    const basedIndexRequest = path.join(baseUrl, request, 'index.js');
                    existsPath = fs.existsSync(basedIndexRequest) ? basedIndexRequest : '';
                }
            }
            existsCache[request] = existsPath;
        }
        return origRequire.call(this, existsPath || request);
    }
})()