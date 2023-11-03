module.exports = {
	apps: [{
		name: "point:9998",
		script: 'dist/www/index.js',
		env: {
			NODE_ENV: process.env['NODE_ENV'],
			host: process.env['host'],
			server: process.env['host'],
			PORT: Number(process.env['PORT']),
			DB_USER: process.env['DB_USER'],
			DB_PWD: process.env['DB_PWD'],
			DB_SCHEMA: process.env['DB_SCHEMA'],
			SECRET_ODF_KEY: process.env['SECRET_ODF_KEY'],
			ALGORITH_ENCRYPTED: process.env['ALGORITH_ENCRYPTED'],
			IV: process.env['IV'],
			trustServerCertificate: process.env['trustServerCertificate'],
			ROOT_DIR: process.env['ROOT_DIR'],
			STATIC_DIST: process.env['STATIC_DIST'],
			viewOdfsGathered: process.env['viewOdfsGathered'],
			MS_COLUMN_DESCRIPTION_MOTIVES_POINT: process.env['MS_COLUMN_DESCRIPTION_MOTIVES_POINT'],
		},
	},]
};
