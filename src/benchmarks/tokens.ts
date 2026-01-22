import ora from 'ora';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

dotenv.config();

export async function benchmarkTokenGeneration(modelId: string = 'groq:llama-3.3-70b-versatile') {
  const spinner = ora(`Initializing Token Benchmark for ${modelId}...`).start();

  try {
    const [provider, modelName] = modelId.split(':');
    
    if (provider !== 'groq') {
      spinner.fail(`Unsupported provider: ${provider}. Chronos is currently optimized for Groq.`);
      return;
    }

    if (!process.env.GROQ_API_KEY) {
      spinner.warn(`No GROQ_API_KEY found. Running simulation...`);
      await simulateTokenGen();
      return;
    }

    const model = groq(modelName);

    spinner.text = `Streaming from Groq (${modelName})...`;
    
    const startTime = Date.now();
    let firstTokenTime: number | null = null;
    let tokenCount = 0;
    let fullText = '';

    const result = await streamText({
      model: model,
      prompt: 'Write a 100-word story about a time-traveling clock.',
    });

    for await (const delta of result.textStream) {
      if (firstTokenTime === null) {
        firstTokenTime = Date.now();
      }
      fullText += delta;
      // Rough token estimation: 1 token ~= 4 characters
      tokenCount = Math.ceil(fullText.length / 4);
    }

    const endTime = Date.now();
    const totalDuration = (endTime - startTime) / 1000;
    const ttft = firstTokenTime ? (firstTokenTime - startTime) / 1000 : 0;
    const generationDuration = (endTime - (firstTokenTime || startTime)) / 1000;
    const tps = tokenCount / generationDuration;

    spinner.succeed(`Benchmark Complete: ${modelId}`);
    console.log(chalk.cyan(`  Time to First Token (TTFT): ${ttft.toFixed(3)}s`));
    console.log(chalk.green(`  Total Duration: ${totalDuration.toFixed(2)}s`));
    console.log(chalk.green(`  Est. Tokens: ${tokenCount}`));
    console.log(chalk.bold.blue(`  Speed: ${tps.toFixed(2)} tokens/sec`));

  } catch (error: any) {
    spinner.fail('Token Benchmark Failed');
    console.error(chalk.red(error.message || error));
  }
}

async function simulateTokenGen() {
  const startTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate TTFT
  const firstTokenTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate generation
  const endTime = Date.now();

  const ttft = (firstTokenTime - startTime) / 1000;
  const totalDuration = (endTime - startTime) / 1000;
  const tps = 50; // Simulated

  console.log(chalk.yellow('  [SIMULATION MODE]'));
  console.log(chalk.cyan(`  Time to First Token (TTFT): ${ttft.toFixed(3)}s`));
  console.log(chalk.green(`  Total Duration: ${totalDuration.toFixed(2)}s`));
  console.log(chalk.bold.blue(`  Speed: ${tps.toFixed(2)} tokens/sec`));
}
