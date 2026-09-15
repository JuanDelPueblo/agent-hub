# Documentation style guide

Batey documentation should be clear, practical, and human. Write like someone explaining a project they built and care about, not like corporate or academic documentation.

## Voice

Write naturally and directly. Complete sentences and explanatory paragraphs are welcome when they make something easier to understand.

Personality is welcome too. It is fine to call something beautiful, annoying, convenient, simpler, safer, or better when that is genuinely the point being made. Enthusiasm should come from the project itself, not generic marketing language.

Prefer concrete descriptions:

> Run multiple agents against the same Git project without making them fight over a working directory.

Instead of abstract ones:

> Batey provides concurrent workspace isolation capabilities for Git-based projects.

Use **Batey** when describing the software and **you** freely when speaking to the reader. First-person **we** is acceptable when discussing project goals, decisions, or recommendations.

Contractions are fine.

## Writing

Prefer straightforward language over technical-sounding language.

Explain important reasoning when it helps the reader understand a decision or avoid a mistake. Obvious instructions do not need justification.

Use the actual names of features, components, files, protocols, and commands. Do not invent terminology to make documentation sound more technical.

Keep writing focused. Do not expand a simple idea into several paragraphs when one will do, but do not sacrifice useful context just to make something shorter.

Avoid repeating the same information in several places. Put detailed information where it naturally belongs and reference it elsewhere when needed.

## Formatting

Use sentence case for headings and keep them short.

Use paragraphs for explanations, bullets for independent items, and numbered lists when order matters. Avoid excessive nesting.

Feature or labeled lists should use:

> - **Name** - Description.

Use backticks for commands, paths, configuration keys, symbols, API routes, and literal values.

Use fenced code blocks for commands or configuration the reader is expected to copy.

Use descriptive link text when it reads naturally. Raw URLs are fine when the URL itself is useful information.

## Terminology

Use established project terminology consistently. Do not alternate between different names for the same concept without a reason.

Use exact spelling and capitalization for visible UI labels.

When documenting requirements:

- **must** - required
- **must not** - prohibited
- **should** - recommended, with valid exceptions
- **may** - optional

Do not weaken important requirements with vague language.

## Editing existing documentation

Preserve the author's intent and personality.

Fix incorrect or outdated information, obvious grammar problems, and ambiguity. Add what the task requires and leave unrelated writing alone.

Do not automatically rewrite human-written documentation into more formal prose. Do not remove enthusiasm merely because it is subjective.

Above all, make the documentation useful and pleasant to read.
