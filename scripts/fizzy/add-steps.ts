#!/usr/bin/env tsx

/**
 * Add steps to a Fizzy card
 * Usage: npm run fizzy:add-steps <card-number> <item1> <item2> ...
 * Or via stdin: cat items.txt | npm run fizzy:add-steps <card-number>
 * Or: tsx scripts/fizzy/add-steps.ts <card-number> <item1> <item2> ...
 */

import { config } from 'dotenv';
import { createInterface } from 'readline';

// Load .env file
config();

async function addStep(
  accountSlug: string,
  apiToken: string,
  cardNumber: number,
  content: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://app.fizzy.do/${accountSlug}/cards/${cardNumber}/steps.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          step: {
            content,
            completed: false,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error(`Failed to add step "${content}": ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error adding step "${content}":`, error instanceof Error ? error.message : error);
    return false;
  }
}

async function addSteps(cardNumber: number, items: string[]): Promise<void> {
  const apiToken = process.env.FIZZY_API_TOKEN;
  const accountSlug = process.env.FIZZY_ACCOUNT_SLUG;

  if (!apiToken || !accountSlug) {
    console.error('Error: Missing Fizzy credentials in .env file');
    console.error('Required: FIZZY_API_TOKEN, FIZZY_ACCOUNT_SLUG');
    process.exit(1);
  }

  console.log(`Adding ${items.length} items to Fizzy card #${cardNumber}...`);

  let successCount = 0;
  let failCount = 0;

  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;

    const success = await addStep(accountSlug, apiToken, cardNumber, trimmed);
    if (success) {
      successCount++;
      process.stdout.write('.');
    } else {
      failCount++;
      process.stdout.write('x');
    }
  }

  console.log('\n');
  console.log(`✓ Added ${successCount} items to Fizzy card #${cardNumber}`);

  if (failCount > 0) {
    console.log(`✗ Failed to add ${failCount} items`);
  }

  console.log(`View card: https://app.fizzy.do/${accountSlug}/cards/${cardNumber}`);

  if (failCount > items.length / 2) {
    console.error('\nWarning: Many items failed to sync. Check API credentials.');
    process.exit(1);
  }
}

// CLI usage
const cardNumber = parseInt(process.argv[2], 10);

if (!cardNumber || isNaN(cardNumber)) {
  console.error('Usage: npm run fizzy:add-steps <card-number> [item1] [item2] ...');
  console.error('Or via stdin: cat items.txt | npm run fizzy:add-steps <card-number>');
  process.exit(1);
}

// Items can come from command line args or stdin
const cliItems = process.argv.slice(3);

if (cliItems.length > 0) {
  // Items provided as command line arguments
  addSteps(cardNumber, cliItems);
} else {
  // Read items from stdin
  const items: string[] = [];
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    items.push(line);
  });

  rl.on('close', () => {
    if (items.length === 0) {
      console.error('Error: No items provided');
      process.exit(1);
    }
    addSteps(cardNumber, items);
  });
}
