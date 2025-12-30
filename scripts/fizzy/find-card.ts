#!/usr/bin/env tsx

/**
 * Find a Fizzy card by tag name
 * Usage: npm run fizzy:find-card <tag-name>
 * Or: tsx scripts/fizzy/find-card.ts <tag-name>
 * Returns: Card number (or exits with error)
 */

import { config } from 'dotenv';

// Load .env file
config();

interface Tag {
  id: string;
  title: string;
  created_at: string;
  url: string;
}

interface Card {
  id: string;
  number: number;
  title: string;
  tags: string[];
  url: string;
}

async function findCardByTag(tagName: string): Promise<number> {
  const apiToken = process.env.FIZZY_API_TOKEN;
  const accountSlug = process.env.FIZZY_ACCOUNT_SLUG;

  if (!apiToken || !accountSlug) {
    console.error('Error: Missing Fizzy credentials in .env file');
    console.error('Required: FIZZY_API_TOKEN, FIZZY_ACCOUNT_SLUG');
    process.exit(1);
  }

  try {
    // Step 1: Get tag ID
    const tagsResponse = await fetch(`https://app.fizzy.do/${accountSlug}/tags.json`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json',
      },
    });

    if (!tagsResponse.ok) {
      throw new Error(`Failed to fetch tags: ${tagsResponse.status} ${tagsResponse.statusText}`);
    }

    const tags: Tag[] = await tagsResponse.json();
    const tag = tags.find((t) => t.title === tagName);

    if (!tag) {
      console.error(`Error: Tag "${tagName}" not found in Fizzy`);
      console.error('Available tags:', tags.map((t) => t.title).join(', '));
      process.exit(1);
    }

    // Step 2: Get cards with that tag
    const cardsResponse = await fetch(
      `https://app.fizzy.do/${accountSlug}/cards.json?tag_ids[]=${tag.id}`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!cardsResponse.ok) {
      throw new Error(`Failed to fetch cards: ${cardsResponse.status} ${cardsResponse.statusText}`);
    }

    const cards: Card[] = await cardsResponse.json();

    if (cards.length === 0) {
      console.error(`Error: No cards found with tag "${tagName}"`);
      console.error(`Please tag a Fizzy card with "${tagName}"`);
      process.exit(1);
    }

    return cards[0].number;
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// CLI usage
const tagName = process.argv[2];

if (!tagName) {
  console.error('Usage: npm run fizzy:find-card <tag-name>');
  process.exit(1);
}

findCardByTag(tagName).then((cardNumber) => {
  console.log(cardNumber);
});
