import ora from 'ora';
import chalk from 'chalk';
import { chromium } from 'playwright';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import dotenv from 'dotenv';

dotenv.config();

export async function benchmarkAgentTasks() {
  console.log(chalk.gray('  Measuring Agent Task Performance (Real Browser + Real Groq Thinking)...'));

  // Task 1: Real Browser Search with Real Groq Thinking
  const result = await runRealAgentBenchmark('Search Google', 'Chronos AI Benchmark', async (page, query) => {
    await page.goto('https://www.google.com');
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await searchBox.fill(query);
    await searchBox.press('Enter');
    await page.waitForLoadState('networkidle');
  });

  console.log(chalk.yellow('\n--- Real Environment Performance ---'));
  
  // Measure Local Setup Time dynamically
  const setupStart = Date.now();
  const browser = await chromium.launch({ headless: true });
  const setupTime = Date.now() - setupStart;
  await browser.close();

  const environments = [
    { name: 'Local (Playwright - Cold)', setup: setupTime, execution: result.executionTime },
    { name: 'Browserbase (Cloud Reference)', setup: 500, execution: 1800 }, 
  ];

  console.table(environments.map(e => ({
    Environment: e.name,
    'Setup (ms)': Math.round(e.setup),
    'Execution (ms)': Math.round(e.execution),
    'Total (ms)': Math.round(e.setup + e.execution)
  })));
}

async function runRealAgentBenchmark(taskName: string, goal: string, taskFn: (page: any, query: string) => Promise<void>) {
  const spinner = ora(`Agent is thinking about: ${taskName}...`).start();
  
  // 1. REAL THINKING (Groq)
  const thinkingStart = Date.now();
  let searchQueries = [goal];
  
  if (process.env.GROQ_API_KEY) {
    try {
      const { text } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        prompt: `You are an AI agent. Your goal is: "${goal}". What is the best search query to use? Return ONLY the query string.`,
      });
      searchQueries = [text.replace(/"/g, '').trim()];
    } catch (e) {
      spinner.warn('Groq thinking failed, using fallback query.');
    }
  }
  const thinkingTime = Date.now() - thinkingStart;

  // 2. REAL BROWSER SETUP
  spinner.text = `Launching browser for ${taskName}...`;
  const browserStart = Date.now();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const setupTime = Date.now() - browserStart;

  // 3. REAL TOOL EXECUTION
  spinner.text = `Executing task: ${taskName}...`;
  const executionStart = Date.now();
  try {
    await taskFn(page, searchQueries[0]);
    const executionTime = Date.now() - executionStart;
    
    await browser.close();
    const totalTime = thinkingTime + setupTime + executionTime;

    spinner.succeed(`${taskName} Completed (Query: "${searchQueries[0]}")`);
    console.log(chalk.gray(`  Total Time: ${(totalTime / 1000).toFixed(3)}s`));
    console.log(chalk.blue(`    Thinking (Groq): ${(thinkingTime / 1000).toFixed(3)}s`));
    console.log(chalk.magenta(`    Browser Setup: ${(setupTime / 1000).toFixed(3)}s`));
    console.log(chalk.cyan(`    Tool Execution (Playwright): ${(executionTime / 1000).toFixed(3)}s`));
    
    return { thinkingTime, setupTime, executionTime };
  } catch (error) {
    spinner.fail(`${taskName} Failed`);
    console.error(error);
    await browser.close();
    throw error;
  }
}
