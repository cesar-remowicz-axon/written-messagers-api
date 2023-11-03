"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pictures = void 0;
const fs = require("fs");
const path = require("path");
const picturesFolder = path.join(__dirname, '../../static/images');
const OUTPUT_FOLDER = `/images`;
exports.pictures = {
    getPicturePath: async (item, hex, sufixo, i) => {
        const filename = `/${item}${sufixo || ''}${i}.jpg`;
        const url = OUTPUT_FOLDER + filename;
        const filePath = path.join(picturesFolder, filename);
        try {
            if (fs.existsSync(filePath)) {
                return url;
            }
            if (hex === null || hex.toString().trim() === '') {
                return `${OUTPUT_FOLDER}/sem_imagem.gif`;
            }
            const buffer = Buffer.from(hex, 'hex');
            fs.writeFileSync(filePath, buffer);
            return url;
        }
        catch (err) {
            console.log(err);
            return `${OUTPUT_FOLDER}/sem_imagem.gif`;
        }
    }
};
//# sourceMappingURL=pictures.js.map