/**
 * @class MitosisProgram
 */
class MitosisProgram {
    /**
     * @constructor
     * @param {Object} param Main parameter object
     * @param {Array<string>} param.argv command line arguments
     * @param {string|Function} param.cwd Current Working Directory
     * @returns {Promise<number>} Returns the copy process final status
     */
    constructor({argv = [], cwd = process.cwd()}) {
        const program = require('commander');
        const pkgjson = require('../package.json');

        program
            .version(pkgjson.version, '-v, --version')
            .description(pkgjson.description)
            .option('-s, --source <path>', 'Source folder to copy', cwd instanceof Function ? cwd() : cwd)
            .option('-d, --destination <path>', 'Root resource to serve')
            .option('-t, --target <string>', 'Target to be replaced, camelCase or kebab-case')
            .option('-r, --replace <string>', 'Name to replace target, camelCase or kebab-case')
            .parse(argv);

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
}
module.exports = async (...args) => new MitosisProgram(...args);
