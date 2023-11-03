"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postApontamento = void 0;
const mssql_1 = __importDefault(require("mssql"));
const global_config_1 = require("../../global.config");
const postApontamento = async (req, res) => {
    req.body["codigoBarras"] = sanitize(req.body["codigoBarras"].trim());
    let barcode = req.body["codigoBarras"];
    function sanitize(input) {
        const allowedChars = /[A-Za-z0-9]/;
        return input.split("").map((char) => (allowedChars.test(char) ? char : "")).join("");
    }
    if (barcode == '') {
        return res.status(400).redirect("/#/codigobarras?error=invalidBarcode");
    }
    const dados = {
        numOdf: Number(barcode.slice(10)),
        numOper: String(barcode.slice(0, 5)),
        codMaq: String(barcode.slice(5, 10)),
    };
    if (barcode.length > 17) {
        dados.numOdf = barcode.slice(11);
        dados.numOper = barcode.slice(0, 5);
        dados.codMaq = barcode.slice(5, 11);
    }
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    const queryGrupoOdf = await connection.query(`
    SELECT * FROM VW_APP_APTO_PROGRAMACAO_PRODUCAO WHERE 1 = 1 AND NUMERO_ODF = '${dados.numOdf}' ORDER BY NUMERO_OPERACAO ASC
    `.trim()).then(result => result.recordset);
    if (queryGrupoOdf.length <= 0) {
        return res.json({ message: "okkk" });
    }
    let codigoOperArray = queryGrupoOdf.map(e => e.NUMERO_OPERACAO);
    let arrayAfterMap = codigoOperArray.map(e => "00" + e).toString().replaceAll(' ', "0").split(",");
    let indiceDoArrayDeOdfs = arrayAfterMap.findIndex((e) => e === dados.numOper);
    if (indiceDoArrayDeOdfs < 0) {
        indiceDoArrayDeOdfs = 0;
    }
    let objOdfSelecionada = queryGrupoOdf[indiceDoArrayDeOdfs];
    let objOdfSelecProximo = queryGrupoOdf[indiceDoArrayDeOdfs + 1];
    let objOdfSelecAnterior = queryGrupoOdf[indiceDoArrayDeOdfs - 1];
    let qtdLib = 0;
    let apontLib = '';
    let qntdeJaApontada = 0;
    let qtdLibMax = 0;
    let codigoMaquinaProxOdf;
    let codMaqProxOdf;
    if (indiceDoArrayDeOdfs === 0) {
        codigoMaquinaProxOdf = objOdfSelecProximo["CODIGO_MAQUINA"];
        codMaqProxOdf = objOdfSelecProximo["NUMERO_OPERACAO"];
        qntdeJaApontada = objOdfSelecionada["QTDE_APONTADA"];
        qtdLib = objOdfSelecionada["QTDE_ODF"];
        apontLib = objOdfSelecionada["APONTAMENTO_LIBERADO"];
    }
    if (indiceDoArrayDeOdfs === codigoOperArray.length - 1) {
        codigoMaquinaProxOdf = objOdfSelecionada["CODIGO_MAQUINA"];
        codMaqProxOdf = objOdfSelecionada["NUMERO_OPERACAO"];
        qntdeJaApontada = objOdfSelecionada["QTDE_APONTADA"];
        qtdLib = objOdfSelecAnterior["QTDE_APONTADA"];
        apontLib = objOdfSelecionada["APONTAMENTO_LIBERADO"];
    }
    if (indiceDoArrayDeOdfs > 0 && indiceDoArrayDeOdfs < codigoOperArray.length - 1) {
        codigoMaquinaProxOdf = objOdfSelecProximo["CODIGO_MAQUINA"];
        codMaqProxOdf = objOdfSelecProximo["NUMERO_OPERACAO"];
        qntdeJaApontada = objOdfSelecionada["QTDE_APONTADA"];
        qtdLib = objOdfSelecAnterior["QTDE_APONTADA"];
        apontLib = objOdfSelecionada["APONTAMENTO_LIBERADO"];
    }
    if (qtdLib - qntdeJaApontada === 0) {
        return res.status(400).json({ message: "nolimitonlastodf" });
    }
    qtdLibMax = qtdLib - qntdeJaApontada;
    if (qtdLibMax <= 0 && apontLib === "N") {
        return res.status(400).redirect("/#/codigobarras?error=anotherodfexpected");
    }
    if (objOdfSelecAnterior === undefined) {
        await connection.query(`
        UPDATE 
        PCP_PROGRAMACAO_PRODUCAO 
        SET 
        APONTAMENTO_LIBERADO = 'S' 
        WHERE 1 = 1 
        AND NUMERO_ODF = '${dados.numOdf}' 
        AND CAST (LTRIM(NUMERO_OPERACAO) AS INT) = '${dados.numOper}' 
        AND CODIGO_MAQUINA = '${dados.codMaq}'`);
    }
    if (objOdfSelecAnterior === undefined) {
        objOdfSelecAnterior = 0;
    }
    let numeroOper = '00' + objOdfSelecionada.NUMERO_OPERACAO.replaceAll(" ", '0');
    if (objOdfSelecionada['CODIGO_MAQUINA'] === 'RET001') {
        objOdfSelecionada['CODIGO_MAQUINA'] = 'RET01';
    }
    res.cookie('qtdLibMax', qtdLibMax);
    res.cookie("MAQUINA_PROXIMA", codigoMaquinaProxOdf);
    res.cookie("OPERACAO_PROXIMA", codMaqProxOdf);
    res.cookie("NUMERO_ODF", objOdfSelecionada["NUMERO_ODF"]);
    res.cookie("CODIGO_PECA", objOdfSelecionada['CODIGO_PECA']);
    res.cookie("CODIGO_MAQUINA", objOdfSelecionada['CODIGO_MAQUINA']);
    res.cookie("NUMERO_OPERACAO", numeroOper);
    res.cookie("REVISAO", objOdfSelecionada['REVISAO']);
    const codApont = await connection.query(`
    SELECT TOP 1 CODAPONTA FROM HISAPONTA WHERE 1 = 1 AND ODF = '${dados.numOdf}' AND PECA = '${objOdfSelecionada.CODIGO_PECA}' AND ITEM = '${objOdfSelecionada.CODIGO_MAQUINA}'  ORDER BY DATAHORA DESC`.trim()).then(result => result.recordset);
    if (codApont.length < 0) {
        codApont[0].CODAPONTA = "0";
    }
    if (codApont[0].CODAPONTA === 5) {
        return res.status(400).json({ message: "paradademaquina" });
    }
    try {
        const resource2 = await connection.query(`
                    SELECT DISTINCT                 
                       OP.NUMITE,                 
                       CAST(OP.EXECUT AS INT) AS EXECUT,
                       CONDIC,       
                       CAST(E.SALDOREAL AS INT) AS SALDOREAL,                 
                       CAST(((E.SALDOREAL - ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO AND CA.ODF = PCP.NUMERO_ODF),0)) / ISNULL(OP.EXECUT,0)) AS INT) AS QTD_LIBERADA_PRODUZIR,
                       ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO),0) as saldo_alocado
                       FROM PROCESSO PRO (NOLOCK)                  
                       INNER JOIN OPERACAO OP (NOLOCK) ON OP.RECNO_PROCESSO = PRO.R_E_C_N_O_                  
                       INNER JOIN ESTOQUE E (NOLOCK) ON E.CODIGO = OP.NUMITE                
                       INNER JOIN PCP_PROGRAMACAO_PRODUCAO PCP (NOLOCK) ON PCP.CODIGO_PECA = OP.NUMPEC                
                       WHERE 1=1                    
                       AND PRO.ATIVO ='S'                   
                       AND PRO.CONCLUIDO ='T'                
                       AND OP.CONDIC ='P'                 
                       AND PCP.NUMERO_ODF = '${dados.numOdf}'    
                    `.trim()).then(result => result.recordset);
        if (resource2.length > 0) {
            res.cookie("CONDIC", resource2[0].CONDIC);
            let codigoNumite = resource2.map(e => e.NUMITE);
            res.cookie("NUMITE", codigoNumite);
            function calMaxQuant(qtdNecessPorPeca, saldoReal) {
                const pecasPaiPorComponente = qtdNecessPorPeca.map((qtdPorPeca, i) => {
                    return Math.floor((saldoReal[i] || 0) / qtdPorPeca);
                });
                const qtdMaxProduzivel = pecasPaiPorComponente.reduce((qtdMax, pecasPorComp) => {
                    return Math.min(qtdMax, pecasPorComp);
                }, Infinity);
                Math.round(qtdMaxProduzivel);
                return (qtdMaxProduzivel === Infinity ? 0 : qtdMaxProduzivel);
            }
            const execut = resource2.map(item => item.EXECUT);
            const saldoReal = resource2.map(item => item.SALDOREAL);
            let qtdTotal = calMaxQuant(execut, saldoReal);
            const reservedItens = execut.map((quantItens) => {
                return Math.floor((qtdTotal || 0) * quantItens);
            }, Infinity);
            res.cookie("reservedItens", reservedItens);
            const codigoFilho = resource2.map(item => item.NUMITE);
            res.cookie("codigoFilho", codigoFilho);
            let qtdProdOdf = Number(resource2[0].QTDE_ODF);
            let resultadoFinalProducao = Number(Number(qtdTotal) - Number(qtdProdOdf));
            if (resultadoFinalProducao <= 0) {
                resultadoFinalProducao = 0;
                return resultadoFinalProducao;
            }
            res.cookie("resultadoFinalProducao", resultadoFinalProducao);
            const updateQtyQuery = [];
            const updateQtyRes = [];
            for (const [i, qtdItem] of reservedItens.entries()) {
                updateQtyQuery.push(`UPDATE CST_ALOCACAO SET  QUANTIDADE = QUANTIDADE + ${qtdItem} WHERE 1 = 1 AND ODF = '${dados.numOdf}' AND CODIGO_FILHO = '${codigoFilho[i]}';`);
            }
            await connection.query(updateQtyQuery.join("\n"));
            for (const [i, qtdItem] of reservedItens.entries()) {
                updateQtyRes.push(`UPDATE CST_ALOCACAO SET  QUANTIDADE = QUANTIDADE + ${qtdItem} WHERE 1 = 1 AND ODF = '${dados.numOdf}' AND CODIGO_FILHO = '${codigoFilho[i]}';`);
            }
            await connection.query(updateQtyRes.join("\n"));
            return res.status(200).redirect("/#/ferramenta?status=pdoesntexists");
        }
        if (resource2.length <= 0) {
            return res.status(200).json({ message: 'feito' });
        }
    }
    catch (error) {
        console.log('linha 236: ', error);
        return res.json({ message: "CATCH ERRO NO TRY" });
    }
    finally {
        await connection.close();
    }
};
exports.postApontamento = postApontamento;
//# sourceMappingURL=apontamento.js.map