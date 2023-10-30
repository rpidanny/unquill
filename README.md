# Unquill - Elegant Log Parsing for a Better DX

`Unquill` is a lightweight, command-line tool designed to enhance your development experience (DX) when working with services that use the [Quill](https://github.com/rpidanny/quill) logging library.

## Why Unquill?

Quill produces structured JSON logs. While these logs are great for machine consumption, they can be challenging for engineers to read and understand in a local terminal. `Unquill` solves this problem by parsing and formatting Quill logs into a more human-readable format, making it easier to troubleshoot and debug services locally.

## Installation

You can install `Unquill` globally using npm:

```bash
npm i -g @rpidanny/unquill-cli
```

## Usage

Run Unquill with your application using the following syntax:

```bash
unquill [options] -- node app.js
```

### Options

- `-s`: Include the service name in the log.
- `--jq "<jq-filter>"`: Apply a raw [jq](https://jqlang.github.io/jq/tutorial/) filter to include additional fields in the log.

## Example Usage

```bash
unquill -s --jq ".details.userId" -- node app.js
```

## Unquill Mono-Repository

Unquill is organized as a mono-repository consisting of two main components:

1. [unquill-cli](./packages/cli): The command-line interface (CLI) application.
2. [unquill-core](./packages/core): The core log parsing component.

For detailed information on each component, refer to their respective READMEs.

## Log Schema

`Unquill` works with logs that adhere to the following [Quill](https://github.com/rpidanny/quill) log schema:

```typescript
export interface FullLog {
  level: string;
  timestamp: number;
  dateString: string;
  stage?: string;
  environment?: string;
  hostname: string;
  appName?: string;
  componentName?: string;
  region?: string;
  service?: string;
  message?: string;
  details?: Record<string, unknown>;
  err?: {
    name: string;
    message: string;
    stack?: string;
  };
  correlationId?: string;
}
```

## Contributing

If you would like to contribute to `Unquill`, please check out the [GitHub repository](https://github.com/rpidanny/unquill) and feel free to submit issues, pull requests, or provide feedback.

## License

`Unquill` is open-source software licensed under the [MIT License](LICENSE).

---

`Unquill` is developed and maintained by [@rpidanny](https://github.com/rpidanny). If you have any questions, issues, or suggestions, please feel free to contact us.

Happy log parsing with `Unquill`! 🚀
