/**
 * @abstract Mitosis
 * @author  Ricupero Marco
 * @version 1.0
 * @requires fs
 * @requires path
 * @requires lodash
 * @requires @marketto/js-logger
 * @description Perform folder copy and rename placeholders
 * @example const Mitosis = require('./lib/class-mitosis');
 */
class Mitosis {

    /**
     * @method Mitosis::fetch
     * @author  Ricupero Marco
     * @description Fetch a path for its content and return a Promise which will success with a full list of files
     * @param {string} srcPath target path
     * @param {Object} settings fetch settings
     * @param {boolean} [settings.excludeHidden=true] Determinates if hidden files should be excluded or included in the process
     * @param {boolean} [settings.excludeSymLinks=true] Determinates if symbolic links should be excluded or included in the process
     * @returns {Promise<{files: Array<string>, directories: Array<string>}>} All found files and directories in the given srcPath
     * @async
     * @requires fs
     * @requires path
     * @requires lodash
     * @memberof Mitosis
     */
    static async fetch(srcPath, {
        excludeHidden = true,
        excludeSymLinks = true
    } = {
        excludeHidden: true,
        excludeSymLinks: true
    }) {
        const fs = require('fs');
        const path = require('path');
        const _ = require('lodash');

        const promiser = syncFunction => {
            return async (...params) => syncFunction(...params);
        };
        fs.existsSync(srcPath);
        fs.accessSync(srcPath, fs.constants.R_OK);
        return promiser(fs.readdirSync)(srcPath)
            .then(dirContent => {
                const targetContent = excludeHidden ? dirContent.filter(entry => !(/^\./).test(entry)) : dirContent;

                return Promise.all(targetContent.map(entry => {
                    const entryPath = path.join(srcPath, entry);
                    return promiser(fs.statSync)(entryPath)
                        .then(stat => (!excludeSymLinks || !stat.isSymbolicLink()) && stat)
                        .then(stat => {
                            if (!stat) {
                                return null;
                            }
                            if(stat.isDirectory()) {
                                return Mitosis.fetch(entryPath, {
                                    excludeHidden,
                                    excludeSymLinks
                                }).then(({ directories = [], files = [] }) => ({
                                    directories: [entryPath].concat(directories),
                                    files
                                }));
                            }
                            return {files: [entryPath], directories: [path.normalize(srcPath)]};
                        });
                }).concat(targetContent.length ? [] : {directories: [path.normalize(srcPath)]}))
                .then((fetchList = []) => {
                    const out = {directories: [], files: []};
                    fetchList.forEach(({directories = [], files = []}) => {
                        out.files = out.files.concat(files);
                        out.directories = out.directories.concat(directories);
                    });
                    out.directories = _.sortedUniq(out.directories);
                    return out;
                });
            });
    }

    /**
     * @property Mitosis::ABSOLUTE_PATH_MATCHER
     * @author  Ricupero Marco
     * @description Absolute path win/*nix
     * @readonly
     * @static
     * @returns {Regexp} Regular expression to match an absolute win/*nix path
     * @memberof Mitosis
     */
    static get ABSOLUTE_PATH_MATCHER() {
        return /(?:^\/)|(?:^\w:\\)/i;
    }

    /**
     * @method Mitosis::multiCaseReplacer
     * @author  Ricupero Marco
     * @description Generate a custom function wich replace text with the given parameters
     * @param {string} targetString target string to replace with replacingString
     * @param {string} replacingString string to replace with
     * @returns {Function(string)} Replacing function
     * @requires lodash
     * @memberof Mitosis
     */
    static multiCaseReplacer(targetString, replacingString) {
        const _ = require('lodash');

        const replacers = [
            _.camelCase,
            str => _.upperFirst(_.camelCase(str)),
            _.kebabCase,
            str => _.kebabCase(str).toUpperCase(),
            _.snakeCase,
            str => _.snakeCase(str).toUpperCase(),
            _.startCase,
            str => _.startCase(str).toLowerCase(),
            str => _.upperFirst(_.startCase(str).toLowerCase()),
            str => _.startCase(str).toUpperCase()
        ];
        return str => ([str].concat(replacers)).reduce((text, replacer) => {
            return text.replace(new RegExp(replacer(targetString), 'g'), replacer(replacingString));
        });
    }

    /**
     * @method Mitosis::fetch
     * @author  Ricupero Marco
     * @description Path ending part
     * @readonly
     * @static
     * @param {string} path target path
     * @returns {string} Returns only last directory/resource of the given path, excluding additional parameters
     * @requires path
     * @memberof Mitosis
     */
    static pathFinalDir(targetPath = "") {
        const path = require('path');
        const normalizedPath = path.normalize(targetPath);
        if(path.sep !== '\\' && normalizedPath.includes('\\')) {
            return path.win32.basename(normalizedPath);
        }
        return path.basename(normalizedPath);
    }

    /**
     * @method Mitosis::copy
     * @author  Ricupero Marco
     * @description Perform a copy of the source path over the destination path replacing the gin string with the replacing string over file names and contents
     * @param {string} srcPath Source path to copy from
     * @param {string} destPath Destination path to copy to
     * @param {Object} [settings = {targetString, replacingString, cwd}] Additional copy settings
     * @param {string} [settings.targetString = pathFinalDir(srcPath)] Target/Source string to replace with replacingString on the copy
     * @param {string} [settings.replacingString = pathFinalDir(destPath)] Replacing/Destination string
     * @param {string} [settings.encoding = 'utf8'] Encoding to use for read/write
     * @param {string} [settings.cwd = process.cwd()] Current working directory
     * @returns {Promise<{files: Array<string>, directories: Array<string>}>} All copied files and directories in the given destPath
     * @async
     * @requires fs
     * @requires path
     * @requires @marketto/js-logger
     * @memberof Mitosis
     */
    static copy(srcPath, destPath, {
        targetString = this.pathFinalDir(srcPath),
        replacingString = this.pathFinalDir(destPath),
        encoding = 'utf8',
        cwd = process.cwd()
    } = {
        targetString: this.pathFinalDir(srcPath),
        replacingString: this.pathFinalDir(destPath),
        encoding: 'utf8',
        cwd: process.cwd()
    }) {
        const fs = require('fs');
        const path = require('path');
        const logger = require("@marketto/js-logger").global();

        logger.info(`Replacing ${targetString} => ${replacingString} in paths and contents...`);
        const replacer = this.multiCaseReplacer(targetString, replacingString);

        const srcFullPath = this.ABSOLUTE_PATH_MATCHER.test(srcPath) ? srcPath : path.join(cwd, srcPath);
        const destFullPath = this.ABSOLUTE_PATH_MATCHER.test(destPath) ? destPath : path.join(cwd, destPath);

        const promiser = syncFunction => {
            return async (...params) => syncFunction(...params);
        };

        const copiedResources = {
            directories: [],
            files: []
        };

        return this.fetch(srcFullPath).then(({files, directories}) => {
            logger.info('Source path fetched');

            logger.info('Making directories...');
            directories
                .sort()
                .forEach(srcDir => {
                    const destDir = replacer(path.relative(srcFullPath, srcDir));
                    const destDirFullPath = path.join(destFullPath, destDir);
                    if (!fs.existsSync(destDirFullPath)) {
                        fs.mkdirSync(destDirFullPath);
                    }
                    copiedResources.directories.push(path.join(destPath, destDir));
                });

            logger.info('Copying files...');
            return Promise.all(files.map(srcFile => {
                const destFile = replacer(path.relative(srcFullPath, srcFile));
                const destFileFullPath = path.join(destFullPath, destFile);

                logger.info(`Reading ${srcFile}`);
                return promiser(fs.readFileSync)(srcFile, {encoding})
                    .then((data = '') => {
                        logger.info(`Replacing ${path.basename(destFileFullPath)} content...`);
                        return replacer(data);
                    })
                    .then(destinationData => {
                        logger.info(`Writing ${destFileFullPath} ...`);
                        return promiser(fs.writeFileSync)(destFileFullPath, destinationData)
                            .then(() => logger.info(`Successfully created ${destFileFullPath}`));
                    })
                    .then(() => copiedResources.files.push(path.join(destPath, destFile)));
            }));
        })
        .then(() => logger.info('Copy Complete'))
        .then(() => copiedResources);
    }
}

module.exports = Mitosis;
