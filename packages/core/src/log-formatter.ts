import { FullLog, LogLevel } from '@rpidanny/quill';
import { processLine } from '@rpidanny/streamline.js';
import chalk, { ChalkInstance } from 'chalk';
import moment from 'moment';
import { run } from 'node-jq';
import stream from 'stream';

import { LogFormatterOptions } from './log-formatter.interfaces';

export class LogFormatter {
  constructor(private readonly options: LogFormatterOptions) {}

  async stdoutHandler(readable: stream.Readable) {
    await processLine(readable, async (line) => {
      try {
        const logOutput = await this.formatLog(line);
        console.log(logOutput);
      } catch (err) {
        console.log(line);
      }
    });
  }

  async stderrHandler(readable: stream.Readable) {
    await processLine(readable, async (line) => {
      console.log(chalk.red(line));
    });
  }

  private async formatLog(input: string): Promise<string> {
    let logOutput;

    const log = JSON.parse(input) as FullLog;

    const { level, timestamp, service, err, message } = log;
    const stackTrace = err?.stack;
    const errorMessage = err?.message;

    logOutput = `${this.formatTimestamp(timestamp)}${this.formatLogLevel(
      level as LogLevel
    )} ${message}`;

    if (this.options.service && service) {
      logOutput = chalk.green(service) + ': ' + logOutput;
    }

    if (errorMessage) {
      logOutput += `\n${chalk.red.bold(errorMessage)}`;
    }

    if (stackTrace) {
      logOutput += `\n${chalk.red(stackTrace)}`;
    }

    if (this.options.jq) {
      try {
        const jqRes = await run(this.options.jq, log, { input: 'json' });
        logOutput += ` - ${chalk.green(jqRes)}`;
      } catch (err) {
        logOutput += ` - ${chalk.red((err as Error).message)}`;
      }
    }

    return logOutput;
  }

  private formatTimestamp(timestamp: number) {
    const dateString = `${moment(timestamp).format('HH:mm:ss.SSS')} `;
    return chalk.grey(dateString);
  }

  private formatLogLevel(level: LogLevel): string {
    const levelColors: Record<LogLevel, ChalkInstance> = {
      FATAL: chalk.red,
      ERROR: chalk.red,
      WARN: chalk.yellow,
      INFO: chalk.green,
      DEBUG: chalk.gray,
      TRACE: chalk.gray,
    };

    const colorize = levelColors[level] || chalk.green;
    return colorize(level.padEnd(6));
  }
}
