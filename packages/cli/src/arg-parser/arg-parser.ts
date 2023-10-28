import { createCommand } from 'commander';

import { version } from '../../package.json';
import { CommandNotFoundError } from './arg-parser.error';

export interface IArguments {
  service: boolean;
  jq: string;
}

export function getCoreFlags(args: string[]): IArguments {
  const program = createCommand();

  program
    .version(version)
    .option('-s, --service', 'Include service name', false)
    .option('--jq <string>', 'jq filter to apply to the logs')
    .allowUnknownOption(true)
    .hook('preAction', () => {
      console.log('running command');
    });

  program.parse(args);

  return program.opts<IArguments>();
}

export function getCommandToExec(args: string[]): string[] {
  const index = args.indexOf('--');

  if (index === -1) {
    throw new CommandNotFoundError();
  }

  return args.slice(index + 1);
}

export function parseArgs(args: string[]): {
  flags: IArguments;
  commandToExec: string[];
} {
  const flags = getCoreFlags(args);
  const commandToExec = getCommandToExec(args);

  return { flags, commandToExec };
}
