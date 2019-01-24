class MitosisProgram {
    /**
     * @constructor
     * @param {Array<string>} argv command line arguments
     * @param {string|Function} cwd Current Working Directory
     * @returns {Promise<number>} Returns the copy process final status
     */
    constructor({
        argv = process.argv,
        cwd = process.cwd()
    } = {
        argv: process.argv,
        cwd: process.cwd()
    }) {
        const program = this.constructor.cmdParser(argv);

        const logger = require("@marketto/js-logger").global();
        if (!program.destination) {
            logger.error('No destination path provided');
            throw new Error('No destination path provided');
        }

        const Mitosis = require('./mitosis.class');
        return Mitosis.copy(program.source, program.destination, {
            targetString: program.target,
            replacingString: program.replacing,
            cwd: cwd instanceof Function ? cwd() : cwd
        });
    }

    /**
     * @description RegExp to validate proper path win/*nix
     * @static
     * @readonly
     * @property FOLDER_MATCHER
     * @returns {RegExp} RegExp to validate proper path win/*nix
     * @memberof MitosisProgram
     */
    static get FOLDER_MATCHER() {
        return /^(?:(?:[a-z]:|\.{0,2})?(\\|\/))?([^!#$%&+={}[\]\n]+(\\|\/))*[^!#$%&+={}[\]\n]+$/i;
    }

     /**
     * @description Default Source Path
     * @static
     * @readonly
     * @property DEFAULT_SOURCE_PATH
     * @returns {string} Default Source Path
     * @memberof MitosisProgram
     */
    static get DEFAULT_SOURCE_PATH() {
        return './';
    }

    /**
     * @static
     * @method cmdParser
     * @param {Array<string>} argv command line arguments
     * @returns {Commander} Returns a commander instanced with parsed argv
     * @memberof MitosisProgram
     */
    static cmdParser(argv = []) {
        const pkgjson = require('../package.json');
        const program = require('commander');

        return program
            .version(pkgjson.version, '-v, --version')
            .description(pkgjson.description)
            .option('-s, --source <path>', 'Source folder to copy', this.FOLDER_MATCHER, this.DEFAULT_SOURCE_PATH)
            .option('-d, --destination <path>', 'Root resource to serve', this.FOLDER_MATCHER, null)
            .option('-t, --target <string>', 'Target to be replaced, camelCase or kebab-case')
            .option('-r, --replacing <string>', 'Name to replace target, camelCase or kebab-case')
            .parse(argv);
    }
}
module.exports.mitosisProgram = async (...args) => new MitosisProgram(...args);
module.exports.MitosisProgram = MitosisProgram;
