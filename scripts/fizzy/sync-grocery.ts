#!/usr/bin/env tsx

/**
 * Sync grocery list items to Fizzy card tagged with "golden-grocery"
 * Usage: npm run fizzy:sync-grocery <grocery-list-file.md>
 * Or: tsx scripts/fizzy/sync-grocery.ts <grocery-list-file.md>
 */

import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load .env file
config();

interface Tag {
  id: string;
  title: string;
}

interface Card {
  number: number;
  title: string;
  tags: string[];
}

async function findCardByTag(tagName: string): Promise<number | null> {
  const apiToken = process.env.FIZZY_API_TOKEN;
  const accountSlug = process.env.FIZZY_ACCOUNT_SLUG;

  if (!apiToken || !accountSlug) {
    return null;
  }

  try {
    // Get tag ID
    const tagsResponse = await fetch(`https://app.fizzy.do/${accountSlug}/tags.json`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json',
      },
    });

    if (!tagsResponse.ok) return null;

    const tags: Tag[] = await tagsResponse.json();
    const tag = tags.find((t) => t.title === tagName);

    if (!tag) return null;

    // Get cards with that tag
    const cardsResponse = await fetch(
      `https://app.fizzy.do/${accountSlug}/cards.json?tag_ids[]=${tag.id}`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!cardsResponse.ok) return null;

    const cards: Card[] = await cardsResponse.json();
    return cards.length > 0 ? cards[0].number : null;
  } catch {
    return null;
  }
}

async function addStep(cardNumber: number, content: string): Promise<boolean> {
  const apiToken = process.env.FIZZY_API_TOKEN;
  const accountSlug = process.env.FIZZY_ACCOUNT_SLUG;

  if (!apiToken || !accountSlug) return false;

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
          step: { content, completed: false },
        }),
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

function extractShoppingItems(markdownContent: string): string[] {
  const lines = markdownContent.split('\n');
  const items: string[] = [];
  let inShoppingList = false;

  for (const line of lines) {
    // Start of Shopping List section
    if (line.trim() === '## Shopping List') {
      inShoppingList = true;
      continue;
    }

    // End of Shopping List section (hit next section header)
    if (inShoppingList && line.trim().startsWith('## ')) {
      break;
    }

    // Extract items (lines starting with -)
    if (inShoppingList && line.trim().startsWith('-')) {
      const item = line.trim().substring(1).trim();
      if (item) {
        items.push(item);
      }
    }
  }

  return items;
}

async function syncGroceryList(filePath: string): Promise<void> {
  // Check credentials
  const apiToken = process.env.FIZZY_API_TOKEN;
  const accountSlug = process.env.FIZZY_ACCOUNT_SLUG;

  if (!apiToken || !accountSlug) {
    console.log('Fizzy integration skipped. To enable, configure credentials in .env file.');
    console.log('See .env.example for setup instructions.');
    return;
  }

  // Read grocery list file
  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    process.exit(1);
  }

  // Extract shopping items
  const items = extractShoppingItems(content);

  if (items.length === 0) {
    console.log('No shopping items found in the grocery list.');
    return;
  }

  // Find card with "golden-grocery" tag
  console.log('Finding Fizzy card with "golden-grocery" tag...');
  const cardNumber = await findCardByTag('golden-grocery');

  if (!cardNumber) {
    console.log('No card with "golden-grocery" tag found.');
    console.log('Please tag a Fizzy card with "golden-grocery" for grocery lists.');
    return;
  }

  // Add items to card
  console.log(`Adding ${items.length} items to Fizzy card #${cardNumber}...`);

  let successCount = 0;
  let failCount = 0;

  for (const item of items) {
    const success = await addStep(cardNumber, item);
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
  }
}

// CLI usage
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npm run fizzy:sync-grocery <grocery-list-file.md>');
  process.exit(1);
}

syncGroceryList(filePath);
