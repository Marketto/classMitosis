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
     * @returns {Promise<{files: Array<string>, directories: Array<string>}>}
     * @async
     * @requires fs
     * @requires path
     * @requires lodash
     * @memberof Mitosis
     */
    static fetch(srcPath, { 
        excludeHidden = true,
        excludeSymLinks = true
    } = { 
        excludeHidden: true,
        excludeSymLinks: true
    }) {
        const fs = require('fs');
        const path = require('path');
        const _ = require('lodash');
        
        return new Promise(( resolve, reject ) => {
            try {
                fs.existsSync(srcPath);
                fs.accessSync(srcPath, fs.constants.R_OK);
            } catch (e) {
                return reject(e);
            }
            return (new Promise((r, j) => {
                fs.readdir(srcPath, null, (err, data) => {
                    if(err) {
                        throw j(err);
                    }
                    return r(data);
                });
            }))
            .then(dirContent => {
                const targetContent = excludeHidden ? dirContent.filter(entry => !(/^\./).test(entry)) : dirContent;
                
                return Promise.all(targetContent.map(entry => {
                    const entryPath = path.join(srcPath, entry);
                    return new Promise((r, j) => {
                            fs.stat(entryPath, (err, stats) => {
                                if (err) {
                                    return j(err);
                                }
                                return r(stats);
                            });
                        })
                        .then(stat => (!excludeSymLinks || !stat.isSymbolicLink()) && stat)
                        .then(stat => {
                            if (!stat) {
                                return null;
                            }
                            if(stat.isDirectory()) {
                                return Mitosis.fetch(entryPath, {
                                    excludeHidden,
                                    excludeSymLinks
                                }).then(({ directories = [], files = [] }) => {
                                    return {
                                        directories: [entryPath].concat(directories),
                                        files
                                    };
                                });
                            }
                            return {files: [entryPath], directories: [path.normalize(srcPath)]};
                        });
                }).concat(targetContent.length ? [] : {directories: [path.normalize(srcPath)]}))
                .then((fetchList = []) => {
                    if (fetchList.length > 1) {
                        return fetchList.reduce((prev, cur) => ({
                            files: (prev.files || []).concat(cur.files || []),
                            directories: (prev.directories || []).concat(cur.directories || [])
                        }));
                    }
                    return fetchList[0];
                })
                .then(({files, directories}) => ({files, directories: _.sortedUniq(directories)}));
            })
            .then(resolve)
            .catch(reject);
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
            _.snakeCase,
            _.startCase,
            str => _.lowerCase(_.startCase(str))
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
        return path.basename(targetPath);
    }

    /**
     * @method Mitosis::fetch
     * @author  Ricupero Marco
     * @description Perform a copy of the source path over the destination path replacing the gin string with the replacing string over file names and contents
     * @param {string} srcPath Source path to copy from
     * @param {string} destPath Destination path to copy to
     * @param {Object} [settings = {targetString, replacingString, cwd}] Additional copy settings
     * @param {string} [settings.targetString = pathFinalDir(srcPath)] Target/Source string to replace with replacingString on the copy
     * @param {string} [settings.replacingString = pathFinalDir(destPath)] Replacing/Destination string
     * @param {string} [settings.encoding = 'utf8'] Encoding to use for read/write
     * @param {string} [settings.cwd = process.cwd()] Current working directory
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

        return this.fetch(path.join(cwd, srcPath)).then(({files, directories}) => {
            logger.info('Source path fetched');

            
            logger.info('Making directories...');
            directories
                .sort()
                .map(dir => path.join(destFullPath, replacer(path.relative(srcFullPath, dir))))
                .forEach(dir => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                });

            logger.info('Copying files...');
            return Promise.all(files.map(srcFile => {
                const destFile = path.join(destFullPath, replacer(path.relative(srcFullPath, srcFile)))

                return new Promise((resolve, reject) => {
                    logger.info(`Reading ${srcFile}`);
                    fs.readFile(srcFile, {encoding}, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                }).then((data = '') => {
                    logger.info(`Replacing ${path.basename(destFile)} content...`);
                    return replacer(data);
                })
                .then(destinationData => {
                    return new Promise((resolve, reject) => {
                        logger.info(`Writing ${destFile} ...`);

                        fs.writeFile(destFile, destinationData, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                logger.info(`Successfully created ${destFile}`);
                                resolve(data);
                            }
                        });
                    });
                });
            }));
        })
        .then(() => logger.info('Copy Complete'))
        .catch(err => logger.error(err));
    }
}

module.exports = Mitosis;
