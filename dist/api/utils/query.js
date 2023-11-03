"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = void 0;
const global_config_1 = require("../../global.config");
require("dotenv/config");
const mssql_1 = __importDefault(require("mssql"));
const select = async (chosenOption, values) => {
    values = !values ? '' : values;
    const codes = {
        0: `SELECT ${process.env['MS_COLUMN_FOR_ALL_ODFS']} FROM ${process.env['viewOdfsGathered']} (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC`,
        3: `SELECT TOP 1 NUMPEC, QUANT, REVISAO, COMPRIMENTO, LARGURA, AREA, EXECUT FROM OPERACAO(NOLOCK) WHERE 1 = 1 AND NUMPEC = '${values.CODIGO_PECA}' AND REVISAO = ${values.REVISAO} AND NUMITE IS NOT NULL`,
        4: `SELECT * FROM ${process.env['MS_TABLE_CONTAINER_OF_QUANTITES_IN_ADDRESS']} CE WHERE 1 = 1 AND ENDERECO = '${values.ENDERECO}'`,
        5: `SELECT * FROM ${process.env['MS_TABLE_CONTAINER_OF_HISTORY_OF_ODF_POINTED_DETAIL']} WHERE 1 = 1 AND ODF = '${values.NUMERO_ODF}' ORDER BY DATAHORA DESC`,
        6: `SELECT * FROM ${process.env['MS_TABLE_CONTAINER_OF_HISTORY_OF_ODF_POINTED_GENERAL']} WHERE 1 = 1 AND ODF = '${values.NUMERO_ODF}' ORDER BY OP ASC`,
        7: `SELECT CODIGO_CLIENTE,REVISAO,NUMERO_ODF,NUMERO_OPERACAO,CODIGO_MAQUINA,QTDE_ODF,QTDE_APONTADA,QTDE_LIB,QTD_REFUGO,CODIGO_PECA,HORA_FIM,HORA_INICIO,DT_INICIO_OP,DT_FIM_OP,QTD_BOAS FROM ${process.env['viewOdfsGathered']} (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC`,
        drawingFindQuery: `SELECT DISTINCT [${process.env['MS_COLUMN_OF_PART_FOR_DRAWING']}] AS NUMPEC, [${process.env['MS_COLUMN_OF_PART_FOR_IMG_BLOP']}] AS IMAGEM FROM ${process.env['MS_TABLE_CONTAINER_OF_DRAWINGS']} (NOLOCK) WHERE 1 = 1 AND ${process.env['MS_COLUMN_OF_PART_FOR_DRAWING']} = '${values.CODIGO_PECA}' AND ${process.env['MS_COLUMN_OF_STAGE_ODF']} = ${values.REVISAO} AND ${process.env['MS_COLUMN_OF_PART_FOR_IMG_BLOP']} IS NOT NULL`,
        tableOfSupervisors: `SELECT TOP 1 NUMMAQ AS machine, ID_USUARIO, ${process.env['MS_COLUMN_OF_EMPLOYEE_BAGDE']} AS CRACHA FROM ${process.env['MS_TABLE_CONTAINER_OF_SUPERVISORS']} WHERE 1 = 1 AND ${process.env['MS_COLUMN_OF_EMPLOYEE_BAGDE']} = '${values.supervisor}'`,
        tableOfSupervisorSpecificMachine: `SELECT TOP 1 NUMMAQ AS machine, ID_USUARIO, ${process.env['MS_COLUMN_OF_EMPLOYEE_BAGDE']} AS CRACHA FROM ${process.env['MS_TABLE_CONTAINER_OF_SUPERVISORS']} WHERE 1 = 1 AND ${process.env['MS_COLUMN_OF_EMPLOYEE_BAGDE']} = '${values.supervisor}' AND NUMMAQ = '${values.machine}'`,
        tableBadFeedMotives: `SELECT ${process.env['MS_COLUMN_OF_MOTIVES']} AS DESCRICAO FROM ${process.env['MS_TABLE_CONTAINER_OF_BAD_FEED_MOTIVES']} (NOLOCK) ORDER BY ${process.env['MS_COLUMN_OF_MOTIVES']} ASC`,
        tableStopMotives: `SELECT ${process.env['MS_COLUMN_OF_MOTIVES']} AS DESCRICAO FROM ${process.env['MS_TABLE_CONTAINER_OF_STOP_MOTIVES']} (NOLOCK) ORDER BY ${process.env['MS_COLUMN_OF_MOTIVES']} ASC`,
        returnPointMotives: `SELECT ${process.env['MS_COLUMN_OF_MOTIVES']} AS DESCRICAO FROM ${process.env['MS_TABLE_CONTAINER_OF_RETURN_MOTIVES']}`,
        tableAllEmployees: `SELECT USUARIOS_SISTEMA.NOME AS FUNCIONARIO, FUNCIONARIOS.CRACHA FROM USUARIOS_SISTEMA(NOLOCK)
                            INNER JOIN FUNCIONARIOS(NOLOCK) ON FUNCIONARIOS.USUARIO_SISTEMA = USUARIOS_SISTEMA.R_E_C_N_O_ WHERE 1 = 1 AND FUNCIONARIOS.CRACHA = '${values.badge}'`,
        vwForRipData: `SELECT DISTINCT PRO.NUMPEC, PRO.REVISAO, QA_CARACTERISTICA.NUMCAR AS NUMCAR, QA_CARACTERISTICA.CST_NUMOPE AS CST_NUMOPE, QA_CARACTERISTICA.DESCRICAO, ESPECIFICACAO  AS ESPECIF, LIE, LSE, QA_CARACTERISTICA.INSTRUMENTO FROM ${process.env['MS_TABLE_CONTAINER_OF_PROCESS']} PRO INNER JOIN CLIENTES ON PRO.RESUCLI = CLIENTES.CODIGO INNER JOIN QA_CARACTERISTICA ON QA_CARACTERISTICA.NUMPEC=PRO.NUMPEC AND QA_CARACTERISTICA.REV_QA=PRO.REV_QA  AND QA_CARACTERISTICA.REVISAO = PRO.REVISAO  LEFT JOIN (SELECT OP.MAQUIN, OP.NUMPEC, OP.RECNO_PROCESSO, LTRIM(NUMOPE) AS CST_SEQUENCIA FROM OPERACAO OP (NOLOCK)) AS TBL ON TBL.RECNO_PROCESSO = PRO.R_E_C_N_O_  AND TBL.MAQUIN = QA_CARACTERISTICA.CST_NUMOPE WHERE PRO.NUMPEC = '${values.CODIGO_PECA}'  AND PRO.REVISAO = '${values.REVISAO}' AND CST_NUMOPE = '${values.CODIGO_MAQUINA}' AND NUMCAR < '2999' ORDER BY NUMPEC ASC;`,
        vwContaningToolsData: `SELECT [CODIGO] AS CODIGO, [IMAGEM] AS IMAGEM FROM ${process.env['MS_TABLE_CONTAINER_OF_TOOLS']} WHERE 1 = 1 AND IMAGEM IS NOT NULL AND CODIGO = '${values.CODIGO_PECA}' AND MAQUINA = '${values.CODIGO_MAQUINA}' AND NUMOPE = ${values.NUMERO_OPERACAO}`,
        21: `SELECT QUANTIDADE AS QUANTIDADE FROM ${process.env['MS_TABLE_CONTAINER_OF_RESERVATION']} WHERE 1 = 1 AND ODF = ${values.NUMERO_ODF} ORDER BY CODIGO ASC`,
        queryToCheckForAlocatedParts: `SELECT DISTINCT 
PCP.NUMERO_ODF, 
OP.NUMITE, 
OP.NUMSEQ, 
CAST(LTRIM(OP.NUMOPE) AS INT) AS NUMOPE, 
CAST(OP.EXECUT AS INT) AS EXECUT, CONDIC, 
CAST(E.SALDOREAL AS INT) AS SALDOREAL, 
CAST(
((E.SALDOREAL - ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) 
FROM ALOCACAO_POINT CA (NOLOCK)
WHERE CA.CODIGO_FILHO = E.CODIGO AND CA.ODF = PCP.NUMERO_ODF),0)) / ISNULL(OP.EXECUT,0)
) AS INT) AS QTD_LIBERADA_PRODUZIR,
ISNULL(
(
SELECT ISNULL(SUM(QUANTIDADE),0) 
FROM ALOCACAO_POINT CA (NOLOCK) 
WHERE CA.CODIGO_FILHO = E.CODIGO AND CA.ODF = PCP.NUMERO_ODF
)
,0) as RESERVADO
FROM PROCESSO PRO (NOLOCK) 
INNER JOIN OPERACAO OP (NOLOCK) ON OP.RECNO_PROCESSO = PRO.R_E_C_N_O_ 
INNER JOIN ESTOQUE E (NOLOCK) ON E.CODIGO = OP.NUMITE 
INNER JOIN PCP_PROGRAMACAO_PRODUCAO PCP (NOLOCK) ON PCP.CODIGO_PECA = OP.NUMPEC
WHERE 1 = 1 
AND PRO.ATIVO ='S' 
AND PRO.CONCLUIDO ='T' 
AND OP.CONDIC ='P' 
AND PCP.NUMERO_ODF = '${values.NUMERO_ODF}'
AND OP.NUMSEQ = ${Number(values.NUMERO_OPERACAO)};`,
        tableContainerOfPointedCodes: `SELECT TOP 1 ${process.env['MS_COLUMN_FROM_POINTED_CODES']} FROM ${process.env['MS_TABLE_CONTAINER_OF_POINTED_CODES']} WHERE 1 = 1 AND ODF = '${values.NUMERO_ODF}' ORDER BY ${process.env['MS_COLUMN_ORDER_FROM_POINTED_CODES']} DESC;`,
        29: `SELECT TOP 1 SALDO FROM ${process.env['MS_TABLE_CONTAINER_FOR_ODF_AND_NOTE']} WHERE 1 = 1 AND CODIGO = '${values.partCode}' ORDER BY DATA DESC;`,
        30: `SELECT TOP 1 QTDE_LIB FROM ${process.env['viewOdfsGathered']} WHERE 1 = 1 AND NUMERO_ODF = '${values.NUMERO_ODF}' AND CODIGO_MAQUINA = '${values.CODIGO_MAQUINA}' AND NUMERO_OPERACAO = ${values.NUMERO_OPERACAO};`,
        31: `SELECT * FROM ${process.env['MS_TABLE_CONTAINER_FOR_HISTORY_OF_ADDRESS']} WHERE 1 = 1 AND ODF = '${values.NUMERO_ODF}' AND NUMERO_OPERACAO = ${Number(values.NUMERO_OPERACAO)} ORDER BY DATAHORA DESC;`,
        feedOdf: `SELECT TOP 1 * FROM ${process.env['MS_VIEW_CONTAINER_OF_ALL_ODFS']} WHERE 1 = 1 AND NUMPEC = '${values.CODIGO_PECA}' AND NUMERO_ODF = '${values.NUMERO_ODF}' AND NUMERO_OPERACAO = ${Number(values.NUMERO_OPERACAO)} AND CODIGO_MAQUINA = '${values.CODIGO_MAQUINA}' AND CODIGO_PECA = '${values.CODIGO_PECA}' AND REVISAO = '${values.REVISAO}';`,
        userAvailable: `SELECT EMPLOYEE_MOD, ENDERECO_MOD, RIP_MOD, DESENHO_TECNICO_MOD, FERRAMENTA_MOD, SUPERVISOR_MOD, MOTIVOS_MOD, EMAIL_MOD, ESTOQUE_MOD, HISTORICO_MOD FROM ${process.env['MS_TABLE_CONTAINER_USER_HIRED_MODULES']} WHERE 1 = 1 AND COMPANY_ID = ${values.COMPANY_ID};`,
        viewOdfsGathered: `SELECT TOP 1 REVISAO, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_ODF, QTDE_APONTADA, QTDE_LIB, CODIGO_PECA, QTD_BOAS, QTD_REFUGO, QTD_FALTANTE, QTD_RETRABALHADA, CODIGO_CLIENTE FROM ${process.env['viewOdfsGathered']} (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND NUMERO_OPERACAO = ${values.NUMERO_OPERACAO} AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC;`,
        codAponta: `SELECT TOP 1 NUMOPE, CODAPONTA, USUARIO, CAMPO1, CAMPO2, DATAHORA FROM HISAPONTA(NOLOCK) WHERE 1 = 1 AND ODF = '${values.NUMERO_ODF}' ORDER BY R_E_C_N_O_ DESC;`,
        PCPTOP1: `SELECT TOP 1 REVISAO,NUMERO_ODF,NUMERO_OPERACAO,CODIGO_MAQUINA,QTDE_ODF,QTDE_APONTADA,QTDE_LIB,CODIGO_PECA,QTD_BOAS,QTD_REFUGO,QTD_FALTANTE,QTD_RETRABALHADA,CODIGO_CLIENTE,QTD_ESTORNADA FROM ${process.env['viewOdfsGathered']} (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = ${values.NUMERO_ODF} AND NUMERO_OPERACAO = ${values.NUMERO_OPERACAO} AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC;`,
        OperacaoSemRevisao: `SELECT TOP 1 NUMPEC,QUANT,REVISAO,COMPRIMENTO,LARGURA,AREA,EXECUT FROM OPERACAO(NOLOCK) WHERE 1 = 1 AND NUMPEC = '${values.CODIGO_PECA}';`,
        SelectAllOdfs: `WITH Top10UniqueNumeros AS (
                        SELECT DISTINCT TOP 5 NUMERO_ODF
                        FROM ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} 
                        WHERE 1 = 1
                        ORDER BY NUMERO_ODF DESC)
                        SELECT CODIGO_PECA,NUMERO_ODF,CODIGO_MAQUINA,QTDE_ODF,NUMERO_OPERACAO,CODIGO_CLIENTE
                        FROM ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']}
                        WHERE NUMERO_ODF IN (SELECT NUMERO_ODF FROM Top10UniqueNumeros)
                        ORDER BY NUMERO_OPERACAO ASC;`,
        SearchOdf: `WITH Top10UniqueNumeros AS (
			SELECT DISTINCT TOP 5 NUMERO_ODF
			FROM PCP_PROGRAMACAO_PRODUCAO(NOLOCK)
			WHERE 1 = 1
			AND NUMERO_ODF LIKE '${values.barcode}%'
			ORDER BY NUMERO_ODF DESC
        )
        SELECT CODIGO_PECA,NUMERO_ODF,CODIGO_MAQUINA,QTDE_ODF,NUMERO_OPERACAO,CODIGO_CLIENTE
        FROM PCP_PROGRAMACAO_PRODUCAO(NOLOCK)
        WHERE NUMERO_ODF IN (SELECT NUMERO_ODF FROM Top10UniqueNumeros)
        ORDER BY NUMERO_OPERACAO ASC;`,
        historyStoragePointed: `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${process.env['MS_TABLE_STORAGE_POINTED_HISTORIC']}')
                                    BEGIN
                                        CREATE TABLE ${process.env['MS_TABLE_STORAGE_POINTED_HISTORIC']} (
                                            ID INT IDENTITY,
                                            DATAHORA DATETIME,
                                            STATUS VARCHAR(7),
                                            ODF VARCHAR(200), 
                                            CODIGO_PECA VARCHAR(200),
                                            QUANTIDADE INT,
                                            USUARIO VARCHAR(200)
                                        )
                                    END 
                SELECT DATAHORA, STATUS, ODF, CODIGO_PECA, QUANTIDADE, USUARIO FROM ${process.env['MS_TABLE_STORAGE_POINTED_HISTORIC']} WHERE 1 = 1 AND ODF = '${values.NUMERO_ODF}' ORDER BY DATAHORA DESC;`,
        deleteOdfQuery: `DELETE ${process.env['MS_TABLE_CONTAINER_OF_ALL_ODFS']} WHERE 1 = 1 AND NUMERO_ODF = '${values.NUMERO_ODF}';`,
        partStorage: `SELECT SALDOREAL AS quantity, DESCRI AS descricao, UNIDADE AS unity, PESO AS weight, FREQUENCIA AS frequency FROM ESTOQUE(NOLOCK) WHERE 1 = 1 AND CODIGO = '${values.part}';`,
        addressPerPart: `SELECT R_E_C_N_O_ AS id, ENDERECO AS address, ODF AS odfNumber, QUANTIDADE AS quantity, ODF AS numberOdf, DATAHORA as date FROM CST_ESTOQUE_ENDERECOS(NOLOCK) WHERE 1 = 1 AND CODIGO = '${values.part}';`,
        dashboardProductionWeekReport: `DECLARE @StartDate DATE = GETDATE();
                                        DECLARE @EndDate DATE = DATEADD(DAY, 7, @StartDate);
                                        SELECT 
                                        DATAHORA AS date,
                                        USUARIO AS employee,
                                        ODF AS odfNumber,
                                        REVISAO AS revisionNumber,
                                        NUMOPE AS operationNumber,
                                        CONDIC as partType,
                                        ITEM AS machine,
                                        QTD AS quantity,
                                        PC_BOAS AS goodParts,
                                        PC_REFUGA AS badParts,
                                        CODAPONTA AS pointedCode
                                        FROM HISAPONTA(NOLOCK)
                                        WHERE 1 = 1 
                                        --AND CODAPONTA = 3 
                                        AND DATAHORA >= @StartDate AND DATAHORA <= @EndDate;`,
        dashboardProductionDailyReport: `DECLARE @Today DATE = GETDATE();
                                        SELECT 
                                        DATAHORA AS date,
                                        USUARIO AS employee,
                                        ODF AS odfNumber,
                                        REVISAO AS revisionNumber,
                                        NUMOPE AS operationNumber,
                                        CONDIC as partType,
                                        ITEM AS machine,
                                        QTD AS quantity,
                                        PC_BOAS AS goodParts,
                                        PC_REFUGA AS badParts,
                                        CODAPONTA AS pointedCode
                                        FROM HISAPONTA(NOLOCK)
                                        WHERE 1 = 1
                                        AND CODAPONTA = 3 
                                        AND CAST(DATAHORA AS DATE) = @Today;`,
        dashboardProductionMontlyReport: `DECLARE @StartDate DATE = DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0);
                                            DECLARE @EndDate DATE = DATEADD(MONTH, 1, @StartDate);
                                            SELECT 
                                            DATAHORA AS date,
                                            USUARIO AS employee,
                                            ODF AS odfNumber,
                                            REVISAO AS revisionNumber,
                                            NUMOPE AS operationNumber,
                                            CONDIC as partType,
                                            ITEM AS machine,
                                            QTD AS quantity,
                                            PC_BOAS AS goodParts,
                                            PC_REFUGA AS badParts,
                                            CODAPONTA AS pointedCode
                                            FROM HISAPONTA(NOLOCK)
                                            WHERE 1 = 1
                                            AND CODAPONTA = 3 
                                            AND DATAHORA >= @StartDate
                                            AND DATAHORA < @EndDate;`,
        dashboardMachineStopped: `SELECT h1.ODF as odfNumber, h1.CODAPONTA as pointedCode
                                    FROM HISAPONTA h1
                                    WHERE h1.CODAPONTA = 7
                                    AND NOT EXISTS (
                                        SELECT 1
                                        FROM HISAPONTA(NOLOCK) h2
                                        WHERE h2.ODF = h1.ODF
                                        AND h2.CODAPONTA = 3
                                        AND h2.R_E_C_N_O_ > h1.R_E_C_N_O_);`,
        dashBoardTotalWeeklyAmountOfParts: `SELECT 
                                                    ISNULL(SUM(QTD_ESTORNADA), 0) AS totalReturnParts,
                                                    ISNULL(SUM(QTD_BOAS), 0) AS totalGoodParts,
                                                    ISNULL(SUM(QTD_REFUGO), 0) AS totalBadParts,
                                                    ISNULL(SUM(QTD_FALTANTE), 0) AS totalMissingParts,
                                                    ISNULL(SUM(QTD_RETRABALHADA), 0) AS totalReworkParts
                                                    FROM PCP_PROGRAMACAO_PRODUCAO(NOLOCK)
                                                    WHERE CONVERT(DATE, DT_INICIO_OP, 112) BETWEEN DATEADD(WEEK, -1, GETDATE()) AND GETDATE();`,
        dashBoardTotalMonthlyAmountOfParts: `SELECT 
                                                ISNULL(SUM(QTD_ESTORNADA), 0) AS totalReturnParts,
                                                ISNULL(SUM(QTD_BOAS), 0) AS totalGoodParts,
                                                ISNULL(SUM(QTD_REFUGO), 0) AS totalBadParts,
                                                ISNULL(SUM(QTD_FALTANTE), 0) AS totalMissingParts,
                                                ISNULL(SUM(QTD_RETRABALHADA), 0) AS totalReworkParts
                                            FROM PCP_PROGRAMACAO_PRODUCAO(NOLOCK)
                                            WHERE CONVERT(DATE, DT_INICIO_OP, 112) BETWEEN 
                                                DATEADD(MONTH, -1, GETDATE())
                                                AND GETDATE();`,
        dashboardOdfInProductionFor10Months: `SELECT h1.ODF as odfNumber, h1.CODAPONTA as pointedCode
                                                FROM HISAPONTA(NOLOCK) h1
                                                WHERE h1.CODAPONTA = 3
                                                AND NOT EXISTS (
                                                    SELECT 1
                                                    FROM HISAPONTA h2 (NOLOCK)
                                                    WHERE h2.ODF = h1.ODF
                                                    AND h2.CODAPONTA <> 3
                                                    AND h2.R_E_C_N_O_ > h1.R_E_C_N_O_
                                                )
                                                AND DATAHORA >= DATEADD(MONTH, -10, GETDATE()); `,
        dashboardFinishOdfIn6Months: `SELECT COUNT(p.NUMERO_ODF) as RowCounter
                                        FROM PCP_PROGRAMACAO_PRODUCAO p (NOLOCK)
                                        WHERE p.NUMERO_OPERACAO = '999'
                                        AND p.QTDE_ODF = p.QTDE_APONTADA
                                        AND p.DT_INICIO_OP >= CONVERT(DATE, DATEADD(MONTH, -6, GETDATE()), 112);`,
        dashboardNumberOfReworkODFs6Months: `SELECT STATUS AS stats
                    FROM ${process.env['MS_TABLE_CONTAINER_OF_REWORK_ODFS']}
                    WHERE STATUS = 'Aberto'
                    AND DATAHORA >= DATEADD(MONTH, -6, GETDATE());`,
        dashboardNumberOfReworkODFs1year: `
                    SELECT
                        FORMAT(DATAHORA, 'yyyy-MM') AS Month,
                        COUNT(*) AS Count
                    FROM ${process.env['MS_TABLE_CONTAINER_OF_REWORK_ODFS']}
                    WHERE DATAHORA >= DATEADD(YEAR, -1, GETDATE())
                        AND STATUS = 'Aberto'
                    GROUP BY FORMAT(DATAHORA, 'yyyy-MM')
                    ORDER BY Month;`,
        dashboardFinishOdfIn1YearByMonth: `SELECT
                                                DATEPART(YEAR, p.DT_INICIO_OP) * 100 + DATEPART(MONTH, p.DT_INICIO_OP) AS Month,
                                                COUNT(p.NUMERO_ODF) as RowCounter
                                            FROM PCP_PROGRAMACAO_PRODUCAO p (NOLOCK)
                                            WHERE 1 = 1 
                                                AND p.NUMERO_OPERACAO = '999'
                                                AND p.QTDE_ODF = p.QTDE_APONTADA
                                                AND p.DT_INICIO_OP >= DATEADD(MONTH, -6, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
                                                AND p.DT_INICIO_OP <= DATEADD(MONTH, 6, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
                                            GROUP BY DATEPART(YEAR, p.DT_INICIO_OP) * 100 + DATEPART(MONTH, p.DT_INICIO_OP)

                                            UNION

                                            SELECT
                                                DATEPART(YEAR, p.DT_INICIO_OP) * 100 + DATEPART(MONTH, p.DT_INICIO_OP) AS Month,
                                                COUNT(p.NUMERO_ODF) as RowCounter
                                            FROM PCP_PROGRAMACAO_PRODUCAO p (NOLOCK)
                                            WHERE 1 = 1 
                                                AND p.NUMERO_OPERACAO = '999'
                                                AND p.QTDE_ODF = p.QTDE_APONTADA
                                                AND p.DT_INICIO_OP >= DATEADD(MONTH, -6, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
                                                AND p.DT_INICIO_OP <= DATEADD(MONTH, 6, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
                                            GROUP BY DATEPART(YEAR, p.DT_INICIO_OP) * 100 + DATEPART(MONTH, p.DT_INICIO_OP)

                                            UNION

                                            SELECT
                                                DATEPART(YEAR, p.DT_INICIO_OP) * 100 + DATEPART(MONTH, p.DT_INICIO_OP) AS Month,
                                                COUNT(p.NUMERO_ODF) as RowCounter
                                            FROM PCP_PROGRAMACAO_PRODUCAO p (NOLOCK)
                                            WHERE 1 = 1 
                                                AND p.NUMERO_OPERACAO = '999'
                                                AND p.QTDE_ODF = p.QTDE_APONTADA
                                                AND p.DT_INICIO_OP >= DATEADD(MONTH, -6, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
                                                AND p.DT_INICIO_OP <= DATEADD(MONTH, 6, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
                                            GROUP BY DATEPART(YEAR, p.DT_INICIO_OP) * 100 + DATEPART(MONTH, p.DT_INICIO_OP)
                                            ORDER BY Month;`,
        getAddressForChildrenParts: `SELECT R_E_C_N_O_ AS id, CODIGO AS peca, ENDERECO AS address, QUANTIDADE as quantity FROM CST_ESTOQUE_ENDERECOS(NOLOCK) WHERE 1 = 1 AND CODIGO IN (${values.parts});`,
        getSaldoForChildrenParts: `SELECT R_E_C_N_O_ AS ID, SALDOREAL AS SALDO FROM ESTOQUE(NOLOCK) WHERE 1 = 1 AND CODIGO IN (${values.parts})`,
        getParcialRipData: `SELECT 
                DISTINCT
                DATAHORA,
                NUMCAR AS inspNumber, SETUP AS base, M2 AS base2, M3 AS base3, M4 AS base4, M5 AS base5, M6 AS base6, M7 AS base7, M8 AS base8,M9 AS base9 ,M10 AS base10, M11 AS base11, M12 AS base12, M13 AS base13
                FROM ${process.env['MS_TABLE_CONTAINER_POINTED_RIP']} 
                WHERE 1 = 1 
                AND ODF = '${values.odfNumber}' 
                AND OPERACAO =  '${values.operationNumber}' 
                AND OPE_MAQUIN = '${values.machineName}'
                ORDER BY DATAHORA ASC;`,
        findAddressForTools: `SELECT R_E_C_N_O_ AS id, ENDERECO AS address FROM CST_ESTOQUE_ENDERECOS WHERE 1 = 1 AND CODIGO IN ('${values.parts}');`,
        resourceForOdfNumberRequest: `SELECT R_E_C_N_O_ AS id, QTDE_REAL AS quantity FROM PPEDLISE WHERE 1 = 1 AND NUMODF = '${values.odfNumber}' AND CODPCA = '${values.part}' AND REVISAO = '${values.revisionPhase}';`,
        findAddressForChildren: `SELECT R_E_C_N_O_ AS id, ENDERECO AS address FROM CST_ESTOQUE_ENDERECOS WHERE 1 = 1`
    };
    try {
        const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
        const data = await connection.query(`${codes[String(chosenOption)]}`).then((result) => result.recordset);
        return !data || Number(data['length']) <= 0 ? '' : data;
    }
    catch (error) {
        console.log('Error on Select -', error);
        return '';
    }
};
exports.select = select;
//# sourceMappingURL=query.js.map