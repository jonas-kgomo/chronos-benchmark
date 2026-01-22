#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { runBenchmarks } from './benchmarks/runner.js';

const program = new Command();

program
  .name('chronos')
  .description('AI System Runtime Speed & Agent Task Benchmarking Tool')
  .version('1.0.0');

program
  .command('benchmark')
  .description('Run benchmarks for AI agents')
  .option('-t, --tokens', 'Benchmark token generation speed')
  .option('-a, --agents', 'Benchmark agent task performance (WebSearch, WebFetch)')
  .option('-m, --model <model>', 'Model to use for token benchmark (e.g. groq:llama-3.3-70b-versatile)', 'groq:llama-3.3-70b-versatile')
  .action(async (options) => {
    console.log(chalk.cyan('Starting Chronos Benchmarks...'));
    await runBenchmarks(options);
  });

program
  .command('resources')
  .description('List resources about AI benchmarking and sandbox environments')
  .action(() => {
    console.log(chalk.bold.blue('\nRecommended Reading:'));
    console.log(chalk.yellow('\nSandbox vs Token Generation:'));
    console.log('  - https://www.anthropic.com/news/claude-3-5-sonnet (Performance benchmarks)');
    console.log('  - https://platform.openai.com/docs/guides/rate-limits (Token limits & latency)');
    
    console.log(chalk.yellow('\nBrowser Infrastructure:'));
    console.log('  - https://docs.browserbase.com/ (Browserbase documentation)');
    console.log('  - https://playwright.dev/docs/intro (Playwright)');
    console.log('  - https://github.com/vercel-labs/agent-browser (Vercel Agent Browser)');
    
    console.log(chalk.yellow('\nBenchmarking Tools:'));
    console.log('  - https://github.com/charmbracelet/vhs (Terminal recording)');
  });

program.parse();
