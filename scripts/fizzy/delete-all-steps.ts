#!/usr/bin/env tsx

/**
 * Delete all steps from a Fizzy card
 * Usage: npm run fizzy:delete-steps <card-number>
 * Or: tsx scripts/fizzy/delete-all-steps.ts <card-number>
 */

import { config } from 'dotenv';

// Load .env file
config();

interface Step {
  id: string;
  content: string;
  completed: boolean;
}

async function getSteps(
  accountSlug: string,
  apiToken: string,
  cardNumber: number
): Promise<Step[]> {
  try {
    const response = await fetch(
      `https://app.fizzy.do/${accountSlug}/cards/${cardNumber}.json`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch card: ${response.status} ${response.statusText}`);
      return [];
    }

    const card = await response.json();
    return card.steps || [];
  } catch (error) {
    console.error('Error fetching card:', error instanceof Error ? error.message : error);
    return [];
  }
}

async function deleteStep(
  accountSlug: string,
  apiToken: string,
  cardNumber: number,
  stepId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://app.fizzy.do/${accountSlug}/cards/${cardNumber}/steps/${stepId}.json`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to delete step ${stepId}: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting step ${stepId}:`, error instanceof Error ? error.message : error);
    return false;
  }
}

async function deleteAllSteps(cardNumber: number): Promise<void> {
  const apiToken = process.env.FIZZY_API_TOKEN;
  const accountSlug = process.env.FIZZY_ACCOUNT_SLUG;

  if (!apiToken || !accountSlug) {
    console.error('Error: Missing Fizzy credentials in .env file');
    console.error('Required: FIZZY_API_TOKEN, FIZZY_ACCOUNT_SLUG');
    process.exit(1);
  }

  console.log(`Fetching steps from Fizzy card #${cardNumber}...`);
  const steps = await getSteps(accountSlug, apiToken, cardNumber);

  if (steps.length === 0) {
    console.log('No steps found on this card.');
    return;
  }

  console.log(`Deleting ${steps.length} steps...`);

  let successCount = 0;
  let failCount = 0;

  for (const step of steps) {
    const success = await deleteStep(accountSlug, apiToken, cardNumber, step.id);
    if (success) {
      successCount++;
      process.stdout.write('.');
    } else {
      failCount++;
      process.stdout.write('x');
    }
  }

  console.log('\n');
  console.log(`✓ Deleted ${successCount} steps from Fizzy card #${cardNumber}`);

  if (failCount > 0) {
    console.log(`✗ Failed to delete ${failCount} steps`);
  }

  console.log(`View card: https://app.fizzy.do/${accountSlug}/cards/${cardNumber}`);
}

// CLI usage
const cardNumber = parseInt(process.argv[2], 10);

if (!cardNumber || isNaN(cardNumber)) {
  console.error('Usage: npm run fizzy:delete-steps <card-number>');
  console.error('Or: tsx scripts/fizzy/delete-all-steps.ts <card-number>');
  process.exit(1);
}

deleteAllSteps(cardNumber);
