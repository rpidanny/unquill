/* eslint-disable camelcase */
import { LogLevel } from '@rpidanny/quill';
import chalk from 'chalk';
import moment from 'moment';
import stream from 'stream';

import { LogFormatter } from './log-formatter';

describe('LogFormatter', () => {
  let logFormatter: LogFormatter;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    const logFormatterOptions = {
      service: true,
    };

    logFormatter = new LogFormatter(logFormatterOptions);

    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should format log', async () => {
    const input = JSON.stringify({
      level: LogLevel.INFO,
      timestamp: 1698276068216,
      service: 'test-service',
      message: 'test-message',
    });

    await logFormatter.stdoutHandler(stream.Readable.from([input]));

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`${chalk.green('test-service')}`)
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`${moment(1698276068216).format('HH:mm:ss')}`)
    );
  });
});
