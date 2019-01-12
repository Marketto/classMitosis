const {Mitosis} = require('../');
const chai = require('chai');

chai.use(require('chai-things'));
chai.should();

describe('Mitosi', () => {

    describe('properties', () => {
        describe('ABSOLUTE_PATH_MATCHER', () => {
            describe('Win32', () => {
                it('Should match d:\\test\\path\\data', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('d:\\test\\path\\data').should.be.true;
                });

                it('Should not match path\\data\\test', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('path\\data\\test').should.be.false;
                });

                it('Should not match \\data', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('\\data').should.be.false;
                });

                it('Should not match ..\\..\\data\\test', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('..\\..\\data\\test').should.be.false;
                });
            });

            describe('Posix', () => {

                it('Should match /test/path/data', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('/test/path/data').should.be.true;
                });

                it('Should not match path/data/test', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('path/data/test').should.be.false;
                });

                it('Should not match ./data', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('./data').should.be.false;
                });

                it('Should not match ../data/test', () => {
                    Mitosis.ABSOLUTE_PATH_MATCHER.test('../data/test').should.be.false;
                });
            });
        });
    });

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
            describe('camelCase', () => {
                it('Should replace testStringCamelCase with replacedTextCamelCase', () => {
                    replacer('testStringCamelCase').should.be.equal('replacedTextCamelCase');
                });
            });

            describe('CamelCase', () => {
                it('Should replace StringTestStringTest with StringReplacedTextTest', () => {
                    replacer('StringTestStringTest').should.be.equal('StringReplacedTextTest');
                });
            });

                
            describe('kebap-case', () => {
                it('Should replace test-string-test-test-string with replaced-text-test-replaced-text', () => {
                    replacer('test-string-test-test-string').should.be.equal('replaced-text-test-replaced-text');
                });
            });

                
            describe('snake-case', () => {
                it('Should replace test_string_test_test_string with replaced_text_test_replaced_text', () => {
                    replacer('test_string_test_test_string').should.be.equal('replaced_text_test_replaced_text');
                });
            });

            describe('Start Case', () => {
                it('Should replace "I am Test string" with "I am Replaced text"', () => {
                    replacer('I am Test string')
                        .should.be.equal('I am Replaced text');
                });
            });

            describe('start case', () => {
                it('Should replace "...sometimes test string" with "...sometimes replaced text"', () => {
                    replacer('...sometimes test string')
                        .should.be.equal('...sometimes replaced text');
                });
            });

            describe('Start case', () => {
                it('Should replace "...rarely Test String" with "...rarely Replaced Text"', () => {
                    replacer('...rarely Test String')
                        .should.be.equal('...rarely Replaced Text');
                });
            });
        });

        describe('fetch', () => {
            const fetchPromise = Mitosis.fetch('examples/test-unit');

            describe('directories', () => {
                it('Should contain test-unit', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include('examples/test-unit')
                        done();
                    });
                });

                it('Should contain test-unit/part', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include('examples/test-unit/part')
                        done();
                    });
                });

                it('Should contain test-unit/part/test-unit-sub-part', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include('examples/test-unit/part/test-unit-sub-part')
                        done();
                    });
                });

                it('Should contain test-unit/section', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.include('examples/test-unit/section')
                        done();
                    });
                });

                it('Should not contain test-unit/part/i-should-not-be-here', done => {
                    fetchPromise.then(({directories}) => {
                        directories.should.not.include('examples/test-unit/part/i-should-not-be-here')
                        done();
                    });
                });
            });

            describe('files', () => {
                it('Should contain test-unit-main.file.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.include('examples/test-unit/test-unit-main.file.js')
                        done();
                    });
                });

                it('Should contain test-unit-sub-part.test.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.include('examples/test-unit/part/test-unit-sub-part/test-unit-sub-part.test.js')
                        done();
                    });
                });

                it('Should contain test-unit-part.class.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.include('examples/test-unit/part/test-unit-part.class.js')
                        done();
                    });
                });

                it('Should not contain i-should-not-be.here.js', done => {
                    fetchPromise.then(({files}) => {
                        files.should.not.include('examples/test-unit/section/i-should-not-be.here.js')
                        done();
                    });
                });
            });
        });
    });

});