import chalk from 'chalk';
import ora from 'ora';
import { benchmarkTokenGeneration } from './tokens.js';
import { benchmarkAgentTasks } from './agents.js';

interface BenchmarkOptions {
  tokens?: boolean;
  agents?: boolean;
  model?: string;
}

export async function runBenchmarks(options: BenchmarkOptions) {
  if (!options.tokens && !options.agents) {
    // Default to running both if no specific option is provided
    options.tokens = true;
    options.agents = true;
  }

  if (options.tokens) {
    console.log(chalk.yellow('\n--- Token Generation Speed Benchmark ---'));
    await benchmarkTokenGeneration(options.model);
  }

  if (options.agents) {
    console.log(chalk.yellow('\n--- Agent Task Performance Benchmark ---'));
    await benchmarkAgentTasks();
  }
}
