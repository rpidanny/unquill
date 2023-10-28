import { LogFormatter } from '@rpidanny/unquill-core';
import chalk from 'chalk';
import { spawn } from 'child_process';

import { parseArgs } from './arg-parser/arg-parser';
import { CommandNotFoundError } from './arg-parser/arg-parser.error';

export async function main() {
  try {
    const { flags, commandToExec } = parseArgs(process.argv);
    const command = commandToExec.join(' ');
    console.log(chalk.blue(`Executing command: ${chalk.bold(command)}`));

    const formatter = new LogFormatter({ ...flags });

    const source = spawn(command, [], {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    await Promise.all([
      formatter.stdoutHandler(source.stdout),
      formatter.stderrHandler(source.stderr),
    ]);
  } catch (error) {
    if (error instanceof CommandNotFoundError) {
      console.log(chalk.red('Please provide a command to execute after --'));
    } else {
      console.error(error);
      throw error;
    }
  }
}
