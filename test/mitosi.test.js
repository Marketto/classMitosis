const chai = require('chai');
const path = require('path');
const logger = require("@marketto/js-logger").global();

chai.use(require('chai-things'));
chai.should();

const targetTestPath = 'examples/test-unit';
const destinationTestPath = 'examples/chai-mitosi-test';

const clearDestPath = () => {
    const rimraf = require('rimraf');
    rimraf.sync(path.join(process.cwd(), destinationTestPath));
};

logger.config = { error: true, info: false, debug: false, warn: false };

describe('Mitosis', () => {
    const {Mitosis} = require('../');

    describe('methods', () => {
        describe('pathFinalDir', () => {
            describe('Win32', () => {
                it('Should return data for d:\\test\\path\\data', () => {
                    Mitosis.pathFinalDir('d:\\test\\path\\data').should.be.equal('data');
                });

                it('Should return test for path\\data\\test\\', () => {
                    Mitosis.pathFinalDir('path\\data\\test\\').should.be.equal('test');
                });

                it('Should return data for \\data', () => {
                    Mitosis.pathFinalDir('\\data').should.be.equal('data');
                });

                it('Should return test for ..\\..\\data\\test', () => {
                    Mitosis.pathFinalDir('..\\..\\data\\test').should.be.equal('test');
                });
            });

            describe('Posix', () => {

                it('Should return data for /test/path/data', () => {
                    Mitosis.pathFinalDir('/test/path/data').should.be.equal('data');
                });

                it('Should return test for path/data/test/', () => {
                    Mitosis.pathFinalDir('path/data/test/').should.be.equal('test');
                });

                it('Should return data for ./data', () => {
                    Mitosis.pathFinalDir('./data').should.be.equal('data');
                });

                it('Should return test for ../data/test', () => {
                    Mitosis.pathFinalDir('../data/test').should.be.equal('test');
                });
            });
        });

        describe('multiCaseReplacer', () => {
            const replacer = Mitosis.multiCaseReplacer('test-string', 'replaced-text');

            it('camelCase - Should replace testStringCamelCase with replacedTextCamelCase', () => {
                replacer('testStringCamelCase').should.be.equal('replacedTextCamelCase');
            });

            it('CamelCase - Should replace StringTestStringTest with StringReplacedTextTest', () => {
                replacer('StringTestStringTest').should.be.equal('StringReplacedTextTest');
            });

            it('kebap-case - Should replace test-string-test-test-string with replaced-text-test-replaced-text', () => {
                replacer('test-string-test-test-string').should.be.equal('replaced-text-test-replaced-text');
            });

            it('KEBAP-CASE - Should replace TEST-STRING-TEST-TEST-STRING with REPLACED-TEXT-TEST-REPLACED-TEXT', () => {
                replacer('TEST-STRING-TEST-TEST-STRING').should.be.equal('REPLACED-TEXT-TEST-REPLACED-TEXT');
            });

            it('snake_case - Should replace test_string_test_test_string with replaced_text_test_replaced_text', () => {
                replacer('test_string_test_test_string').should.be.equal('replaced_text_test_replaced_text');
            });

            it('SNAKE_CASE - Should replace TEST_STRING_TEST_TEST_STRING with REPLACED_TEXT_TEST_REPLACED_TEXT', () => {
                replacer('TEST_STRING_TEST_TEST_STRING').should.be.equal('REPLACED_TEXT_TEST_REPLACED_TEXT');
            });

            it('Start Case - Should replace "I am Test string" with "I am Replaced text"', () => {
                replacer('I am Test string').should.be.equal('I am Replaced text');
            });

            it('start case - Should replace "...sometimes test string" with "...sometimes replaced text"', () => {
                replacer('...sometimes test string').should.be.equal('...sometimes replaced text');
            });

            it('Start case - Should replace "...rarely Test String" with "...rarely Replaced Text"', () => {
                replacer('...rarely Test String').should.be.equal('...rarely Replaced Text');
            });

            it('START CASE - Should replace "...and now also TEST STRING" with "...and now also REPLACED TEXT"', () => {
                replacer('...and now also TEST STRING').should.be.equal('...and now also REPLACED TEXT');
            });
        });

        describe('fetch', () => {
            const fetchPromise = Mitosis.fetch(targetTestPath);

            describe('directories', () => {
                it('Should contain test-unit', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include(targetTestPath)
                        done();
                    }).catch(done);
                });

                it('Should contain test-unit/part', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include(`${targetTestPath}/part`)
                        done();
                    }).catch(done);
                });

                it('Should contain test-unit/part/test-unit-sub-part', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include(`${targetTestPath}/part/test-unit-sub-part`)
                        done();
                    }).catch(done);
                });

                it('Should contain test-unit/section', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include(`${targetTestPath}/section`)
                        done();
                    }).catch(done);
                });

                it('Should not contain test-unit/part/i-should-not-be-here', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.not.include(`${targetTestPath}/part/i-should-not-be-here`)
                        done();
                    }).catch(done);
                });
            });

            describe('files', () => {
                it('Should contain test-unit-main.file.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.include(`${targetTestPath}/test-unit-main.file.js`)
                        done();
                    }).catch(done);
                });

                it('Should contain test-unit-sub-part.test.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.include(`${targetTestPath}/part/test-unit-sub-part/test-unit-sub-part.test.js`)
                        done();
                    }).catch(done);
                });

                it('Should contain test-unit-part.class.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.include(`${targetTestPath}/part/test-unit-part.class.js`)
                        done();
                    }).catch(done);
                });

                it('Should not contain i-should-not-be.here.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.not.include(`${targetTestPath}/section/i-should-not-be.here.js`)
                        done();
                    }).catch(done);
                });
            });
        });

        describe('copy', () => {
            const allDataPromise = done => Promise.all([
                    Mitosis.fetch(targetTestPath),
                    Mitosis.copy(targetTestPath, destinationTestPath)
                        .then(copy => Mitosis.fetch(destinationTestPath).then(dest => ({ copy, dest })))
                ]).catch(done)
                .then(([target, {copy, dest}]) => ({ copy, dest, target }));

            done => Mitosis.copy(targetTestPath, destinationTestPath).then(copy => {
                    return Mitosis.fetch(destinationTestPath).then(dest => ({ copy, dest })).catch(done);
                }).catch(done);

            it('Should return the same, or a subset list, of fetched destination directories', done => {
                allDataPromise(done)
                    .then(({copy, dest}) => {
                        dest.directories.should.include.members(copy.directories);
                        done();
                    });
            });

            it('Should return the same, or a subset list, of fetched destination files', done => {
                allDataPromise(done)
                    .then(({copy, dest}) => {
                        dest.files.should.include.members(copy.files);
                        done();
                    });
            });

            it('Should return the same amount of fetched source directories', done => {
                allDataPromise(done)
                    .then(({copy, target}) => {
                        target.directories.length.should.be.equal(copy.directories.length);
                        done();
                    });
            });

            it('Should return the same amount of fetched source files', done => {
                allDataPromise(done)
                    .then(({copy, target}) => {
                        target.files.length.should.be.equal(copy.files.length);
                        done();
                    });
            });
        });
    });

    after(clearDestPath);
});
