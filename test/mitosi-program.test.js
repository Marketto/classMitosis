const chai = require('chai');
const path = require('path');
const logger = require("@marketto/js-logger").global();

chai.use(require('chai-things'));
chai.should();

const clearDestPath = targetPath => {
    const rimraf = require('rimraf');
    rimraf.sync(path.join(process.cwd(), targetPath));
};

logger.config = { error: true, info: false, debug: false, warn: false };

describe('MitosisProgram', () => {
    const {mitosisProgram, MitosisProgram} = require('../lib/mitosis.program');

    it('Should parse properly', done => {
        const program = MitosisProgram.cmdParser([
            process.argv[0],
            'mitosis',
            '-d',
            './test'
        ]);

        program.source.should.be.equal(MitosisProgram.DEFAULT_SOURCE_PATH);
        program.destination.should.be.equal('./test');
        done();
    });

    it('Should throw an error', done => {
        mitosisProgram({
            argv: [
                process.argv[0],
                'mitosis'
            ],
            cwd: process.cwd()
        })
        .then(status => {
            status.should.be.equal(-1);
            done();
        })
        .catch(err => {
            err.message.should.be.equal('No destination path provided');
            done();
        });
    });

    it('Should perform the copy using local path and deep dest', done => {
        const currentWorkingTestDir = path.join(process.cwd(), 'examples/test-unit');
        const folderToDelete = 'examples/chai';
        const destinationTestPath = path.relative(currentWorkingTestDir, path.join(process.cwd(), folderToDelete, '/deep/mitosi-test'));
        mitosisProgram({
            argv: [
                process.argv[0],
                'mitosis',
                '-d',
                destinationTestPath
            ],
            cwd: currentWorkingTestDir
        })
        .then(({directories = [], files = []}) => {
            directories.should.not.be.empty;
            files.should.not.be.empty;
            clearDestPath(path.relative(process.cwd(), folderToDelete));
            done();
        })
        .catch(err => {
            err.should.be.empty;
            logger.error(err);
            clearDestPath(path.relative(process.cwd(), folderToDelete));
            done(err);
        });
    });

    it('Should perform the copy using source and dest path', done => {
        const currentWorkingTestDir = path.join(process.cwd(), 'examples');
        const sourceTestPath = 'test-unit';
        const destinationTestPath = 'chai-test';
        mitosisProgram({
            argv: [
                process.argv[0],
                'mitosis',
                '-s',
                sourceTestPath,
                '-d',
                destinationTestPath
            ],
            cwd: currentWorkingTestDir
        })
        .then(({directories = [], files = []}) => {
            directories.should.not.be.empty;
            files.should.not.be.empty;
            clearDestPath(path.relative(process.cwd(), path.join(currentWorkingTestDir, destinationTestPath)));
            done();
        })
        .catch(err => {
            err.should.be.empty;
            logger.error(err);
            clearDestPath(path.relative(process.cwd(), path.join(currentWorkingTestDir, destinationTestPath)));
            done(err);
        });
    });
});
