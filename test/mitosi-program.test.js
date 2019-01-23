const chai = require('chai');
const path = require('path');
const logger = require("@marketto/js-logger").global();

chai.use(require('chai-things'));
chai.should();

const targetTestPath = 'examples/test-unit';
const destinationTestBasePath = 'examples/chai';
const destinationTestPath = path.join(destinationTestBasePath, 'deep/mitosi-test');

const clearDestPath = () => {
    const rimraf = require('rimraf');
    rimraf.sync(path.join(process.cwd(), destinationTestBasePath));
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

    it('Should perform the copy using local path', done => {
        const testCurrentWorkingDir = path.join(process.cwd(), targetTestPath);
        mitosisProgram({
            argv: [
                process.argv[0],
                'mitosis',
                '-d',
                path.relative(testCurrentWorkingDir, path.join(process.cwd(), destinationTestPath))
            ],
            cwd: testCurrentWorkingDir
        })
        .then(({directories = [], files = []}) => {
            directories.should.not.be.empty;
            files.should.not.be.empty;
            done();
        })
        .catch(err => {
            err.should.be.empty;
            logger.error(err);
            done(err);
        });
    });

    after(clearDestPath);
});
