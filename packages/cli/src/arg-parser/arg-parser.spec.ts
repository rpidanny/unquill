import { getCommandToExec, getCoreFlags, parseArgs } from './arg-parser'; // Replace with the actual path to your module
import { CommandNotFoundError } from './arg-parser.error';

describe('Arg Parser', () => {
  const secondaryArgs = [
    'node',
    'app.js',
    '--port',
    '3000',
    '--service',
    'test-service',
  ];

  describe('getCoreFlags', () => {
    it('should parse service flag', () => {
      const args = ['node', 'script.js', '--service'];

      const result = getCoreFlags(args);

      expect(result.service).toBe(true);
      expect(result.jq).toBe(undefined);
    });

    it('should parse jq filter flag', () => {
      const args = ['node', 'script.js', '--jq', '".message'];

      const result = getCoreFlags(args);

      expect(result.service).toBe(false);
      expect(result.jq).toBe('".message');
    });

    it('should parse both service and jq flags', () => {
      const args = ['node', 'script.js', '--service', '--jq', '".message'];

      const result = getCoreFlags(args);

      expect(result.service).toBe(true);
      expect(result.jq).toBe('".message');
    });

    it('should handle unrecognized flags', () => {
      const args = ['node', 'script.js', '--unknown-flag'];

      const result = getCoreFlags(args);

      expect(result.service).toBe(false);
      expect(result.jq).toBe(undefined);
    });

    it('should handle command chain', () => {
      const args = ['node', 'script.js', '--', ...secondaryArgs];

      const result = getCoreFlags(args);

      expect(result.service).toBe(false);
      expect(result.jq).toBe(undefined);
    });
  });

  describe('getCommandToExec', () => {
    it('should return the command to execute', () => {
      const args = ['node', 'script.js', '--', ...secondaryArgs];

      const result = getCommandToExec(args);

      expect(result).toEqual(secondaryArgs);
    });

    it('should throw an error if no command is found', () => {
      const args = ['node', 'script.js'];

      expect(() => getCommandToExec(args)).toThrowError(CommandNotFoundError);
    });
  });

  describe('parseArgs', () => {
    it('should return core flags and command to execute', () => {
      const args = ['node', 'script.js', '--', ...secondaryArgs];

      const { flags, commandToExec } = parseArgs(args);

      expect(flags.service).toBe(false);
      expect(flags.jq).toBe(undefined);
      expect(commandToExec).toEqual(secondaryArgs);
    });
  });
});
