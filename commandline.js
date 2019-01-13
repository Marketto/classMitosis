#!/usr/bin/env node
(async () => {
  const program = require('commander');
  const pkgjson = require('./package.json');

  program
    .version(pkgjson.version, '-v, --version')
    .description(pkgjson.description)
    .option('-s, --source <path>', 'Source folder to copy', process.cwd())
    .option('-d, --destination <path>', 'Root resource to serve')
    .option('-t, --target <string>', 'Target to be replaced, camelCase or kebab-case')
    .option('-r, --replace <string>', 'Name to replace target, camelCase or kebab-case')
    .parse(process.argv);

  const logger = require("@marketto/js-logger").global();
  if (!program.destination) {
    logger.error('No destination path provided');
    return -1;
  }

  const { Mitosis } = require('./');
  return Mitosis.copy(program.source, program.destination, {
      targetString: program.target,
      replacingString: program.replacing
    })
    .catch(()=>-1)
    .then(()=>0);
})();
