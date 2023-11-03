"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pictures = void 0;
const fs = require("fs");
const path = require("path");
const picturesRelativePath = path.join(__dirname, "../../static/images");
const OUTPUT_FOLDER = `/images`;
let num = Math.floor(Math.random() * 10);
let item2 = "-" + num;
exports.pictures = {
    getPicturePath: (item, hex) => {
        try {
            const filePath = path.join(picturesRelativePath, `${item}.jpg`);
            if (fs.existsSync(filePath)) {
                return `${OUTPUT_FOLDER}/${item}.jpg`;
            }
            if (hex === null || hex.toString().trim() === "")
                return `${OUTPUT_FOLDER}/sem_imagem.gif`;
            const buffer = Buffer.from(hex, "hex");
            let url = `${OUTPUT_FOLDER}/${item}.jpg`;
            fs.writeFileSync(filePath, buffer);
            if (url === url) {
                url = `${OUTPUT_FOLDER}/${item + item2}.jpg`;
            }
            return url;
        }
        catch (err) {
            console.log(err);
            return `${OUTPUT_FOLDER}/sem_imagem.gif`;
        }
    }
};
//# sourceMappingURL=picture.js.map