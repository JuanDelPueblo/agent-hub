#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, '..');
const srcRoot = path.join(frontendRoot, 'src');
const appRoot = path.join(srcRoot, 'app');

async function walk(dir) {
  const out = [];

  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }

  return out;
}

function applyReplacements(text, replacements) {
  return [...replacements]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (result, { start, end, value }) =>
        result.slice(0, start) + value + result.slice(end),
      text,
    );
}

function propertyName(property) {
  const name = property.name;

  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) {
    return name.text;
  }

  return undefined;
}

function findComponentMetadata(sourceFile) {
  const matches = [];

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'Component' &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      matches.push(node.arguments[0]);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (matches.length !== 1) {
    throw new Error(
      `${sourceFile.fileName}: expected exactly one @Component({...}), ` +
        `found ${matches.length}`,
    );
  }

  return matches[0];
}

function findProperty(metadata, name) {
  return metadata.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      propertyName(property) === name,
  );
}

function readString(initializer, label, file) {
  if (ts.isStringLiteralLike(initializer)) {
    return initializer.text;
  }

  throw new Error(
    `${file}: ${label} must be a string or template literal`,
  );
}

function readStyles(initializer, file) {
  if (ts.isStringLiteralLike(initializer)) {
    return initializer.text;
  }

  if (ts.isArrayLiteralExpression(initializer)) {
    return initializer.elements
      .map((element, index) => {
        if (!ts.isStringLiteralLike(element)) {
          throw new Error(
            `${file}: styles[${index}] is not a string/template literal`,
          );
        }

        return element.text;
      })
      .join('\n\n');
  }

  throw new Error(
    `${file}: styles must be a string, template literal, ` +
      `or array of strings`,
  );
}

function dedentBlock(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  if (lines[0]?.trim() === '') {
    lines.shift();
  }

  if (lines.at(-1)?.trim() === '') {
    lines.pop();
  }

  const nonBlank = lines.filter((line) => line.trim() !== '');

  const indent = nonBlank.length
    ? Math.min(
        ...nonBlank.map(
          (line) => line.match(/^[\t ]*/)?.[0].length ?? 0,
        ),
      )
    : 0;

  const result = lines
    .map((line) =>
      line.trim() === '' ? '' : line.slice(indent),
    )
    .join('\n');

  return result + '\n';
}

function parse(text, file) {
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
}

function resolveRelativeTsImport(
  oldSourceFile,
  specifier,
  allTsFiles,
) {
  const base = path.resolve(
    path.dirname(oldSourceFile),
    specifier,
  );

  const candidates = specifier.endsWith('.ts')
    ? [{ file: base, kind: 'file' }]
    : [
        { file: `${base}.ts`, kind: 'file' },
        { file: path.join(base, 'index.ts'), kind: 'index' },
      ];

  return candidates.find(({ file }) => allTsFiles.has(file));
}

function rewriteRelativeImports(
  text,
  oldSourceFile,
  newSourceFile,
  moveMap,
  allTsFiles,
) {
  const sourceFile = parse(text, oldSourceFile);
  const replacements = [];

  function consider(literal) {
    const specifier = literal.text;

    if (!specifier.startsWith('.')) {
      return;
    }

    const resolved = resolveRelativeTsImport(
      oldSourceFile,
      specifier,
      allTsFiles,
    );

    if (!resolved) {
      return;
    }

    const oldTarget = resolved.file;
    const newTarget = moveMap.get(oldTarget) ?? oldTarget;

    let targetForSpecifier;

    if (specifier.endsWith('.ts')) {
      targetForSpecifier = newTarget;
    } else if (
      resolved.kind === 'index' &&
      !specifier.endsWith('/index')
    ) {
      targetForSpecifier = path.dirname(newTarget);
    } else {
      targetForSpecifier = newTarget.replace(/\.ts$/, '');
    }

    let next = path
      .relative(
        path.dirname(newSourceFile),
        targetForSpecifier,
      )
      .split(path.sep)
      .join('/');

    if (!next.startsWith('.')) {
      next = `./${next}`;
    }

    if (next === specifier) {
      return;
    }

    replacements.push({
      start: literal.getStart(sourceFile) + 1,
      end: literal.getEnd() - 1,
      value: next,
    });
  }

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) ||
        ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      consider(node.moduleSpecifier);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      consider(node.arguments[0]);
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteralLike(node.argument.literal)
    ) {
      consider(node.argument.literal);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return applyReplacements(text, replacements);
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Discover source files
// ---------------------------------------------------------------------------

const allFiles = await walk(srcRoot);

const tsFiles = allFiles.filter(
  (file) =>
    file.endsWith('.ts') &&
    !file.endsWith('.d.ts'),
);

const allTsFiles = new Set(
  tsFiles.map((file) => path.resolve(file)),
);

// This migration is specifically for the repo's existing legacy-style
// component filenames:
//
//   foo.component.ts
//
// Specs are deliberately excluded here.
const componentFiles = tsFiles.filter(
  (file) =>
    file.endsWith('.component.ts') &&
    !file.endsWith('.component.spec.ts'),
);

if (componentFiles.length === 0) {
  console.log('No *.component.ts files found.');
  process.exit(0);
}

// Keep every TS file in memory so all imports can be recalculated before
// anything on disk is deleted.
const contents = new Map();

for (const file of tsFiles) {
  contents.set(
    path.resolve(file),
    await fs.readFile(file, 'utf8'),
  );
}

// Maps:
//
//   old absolute .ts path -> new absolute .ts path
//
// Example:
//
//   chats/chat-header.component.ts
//   ->
//   chats/chat-header/chat-header.ts
const moveMap = new Map();

// Maps newly-created .html/.scss resources to their contents.
const resources = new Map();

let converted = 0;

// The root Angular app component is the only component that does not get
// placed inside its own subdirectory.
//
// Old:
//
//   src/app/app.component.ts
//
// New:
//
//   src/app/app.ts
//   src/app/app.html
//   src/app/app.scss
const rootAppComponent = path.resolve(
  appRoot,
  'app.component.ts',
);

// ---------------------------------------------------------------------------
// Plan component conversions
// ---------------------------------------------------------------------------

for (const componentFileRaw of componentFiles) {
  const componentFile = path.resolve(componentFileRaw);
  const original = contents.get(componentFile);

  const sourceFile = parse(original, componentFile);
  const metadata = findComponentMetadata(sourceFile);

  const templateProp = findProperty(metadata, 'template');
  const stylesProp = findProperty(metadata, 'styles');

  // The script is intended for the current inline components. If something
  // has already been migrated to templateUrl, leave it alone.
  if (!templateProp) {
    console.log(
      `Skipping ${path.relative(
        frontendRoot,
        componentFile,
      )}: no inline template.`,
    );

    continue;
  }

  // Example:
  //
  //   chat-header.component.ts
  //
  // legacyStem = chat-header.component
  // baseName   = chat-header
  const legacyStem = path.basename(
    componentFile,
    '.ts',
  );

  const baseName = legacyStem.replace(
    /\.component$/,
    '',
  );

  const currentDir = path.dirname(componentFile);

  const isRootAppComponent =
    componentFile === rootAppComponent;

  // Destination:
  //
  // Normal component:
  //
  //   chats/chat-header.component.ts
  //   ->
  //   chats/chat-header/chat-header.ts
  //
  // Root component:
  //
  //   app/app.component.ts
  //   ->
  //   app/app.ts
  const destinationDir = isRootAppComponent
    ? currentDir
    : path.join(currentDir, baseName);

  const destinationTs = path.join(
    destinationDir,
    `${baseName}.ts`,
  );

  const htmlFile = path.join(
    destinationDir,
    `${baseName}.html`,
  );

  const styleFile = path.join(
    destinationDir,
    `${baseName}.scss`,
  );

  const template = readString(
    templateProp.initializer,
    'template',
    componentFile,
  );

  const styles = stylesProp
    ? readStyles(
        stylesProp.initializer,
        componentFile,
      )
    : '';

  // Convert:
  //
  //   template: `...`
  //   styles: `...`
  //
  // to:
  //
  //   templateUrl: './chat-header.html'
  //   styleUrl: './chat-header.scss'
  const replacements = [
    {
      start: templateProp.getStart(sourceFile),
      end: templateProp.getEnd(),
      value: `templateUrl: './${baseName}.html'`,
    },
  ];

  if (stylesProp) {
    replacements.push({
      start: stylesProp.getStart(sourceFile),
      end: stylesProp.getEnd(),
      value: `styleUrl: './${baseName}.scss'`,
    });
  } else {
    // Create an empty stylesheet and reference it even when the old
    // component did not define inline styles.
    replacements.push({
      start: metadata.getEnd() - 1,
      end: metadata.getEnd() - 1,
      value: `  styleUrl: './${baseName}.scss',\n`,
    });
  }

  contents.set(
    componentFile,
    applyReplacements(
      original,
      replacements,
    ),
  );

  resources.set(
    htmlFile,
    dedentBlock(template),
  );

  resources.set(
    styleFile,
    dedentBlock(styles),
  );

  moveMap.set(
    componentFile,
    destinationTs,
  );

  // Move and rename a colocated component spec:
  //
  //   chat-header.component.spec.ts
  //
  // ->
  //
  //   chat-header/chat-header.spec.ts
  const oldSpecFile = componentFile.replace(
    /\.component\.ts$/,
    '.component.spec.ts',
  );

  if (allTsFiles.has(oldSpecFile)) {
    const destinationSpec = path.join(
      destinationDir,
      `${baseName}.spec.ts`,
    );

    moveMap.set(
      oldSpecFile,
      destinationSpec,
    );
  }

  converted++;
}

// ---------------------------------------------------------------------------
// Refuse accidental overwrites
// ---------------------------------------------------------------------------

if (!force) {
  const oldFiles = new Set(
    moveMap.keys(),
  );

  const destinations = [
    ...moveMap.values(),
    ...resources.keys(),
  ];

  for (const destination of destinations) {
    // A destination that is also one of the files being moved away from is
    // safe because it belongs to this migration.
    if (oldFiles.has(destination)) {
      continue;
    }

    if (await exists(destination)) {
      throw new Error(
        `Refusing to overwrite ` +
          `${path.relative(frontendRoot, destination)}. ` +
          `Remove it first or rerun with --force.`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Rewrite every relative TypeScript import
// ---------------------------------------------------------------------------
//
// This recalculates imports from both moved and unmoved files.
//
// Examples:
//
// Before:
//
//   import { ChatHeaderComponent } from './chat-header.component';
//
// After moving the importing component:
//
//   import { ChatHeaderComponent } from '../chat-header/chat-header';
//
//
// Before:
//
//   import { ProjectListComponent } from '../projects/project-list.component';
//
// After:
//
//   import { ProjectListComponent } from '../projects/project-list/project-list';
//
//
// The exported class names are intentionally NOT renamed.

const finalTs = new Map();

for (const oldFile of tsFiles.map((file) =>
  path.resolve(file),
)) {
  const newFile =
    moveMap.get(oldFile) ?? oldFile;

  const current =
    contents.get(oldFile);

  finalTs.set(
    oldFile,
    rewriteRelativeImports(
      current,
      oldFile,
      newFile,
      moveMap,
      allTsFiles,
    ),
  );
}

const movedCount = moveMap.size;
const resourceCount = resources.size;

// ---------------------------------------------------------------------------
// Dry run
// ---------------------------------------------------------------------------

if (dryRun) {
  console.log('');
  console.log(
    `Would convert ${converted} components.`,
  );

  console.log(
    `Would move/rename ${movedCount} TypeScript files.`,
  );

  console.log(
    `Would create ${resourceCount} HTML/SCSS files.`,
  );

  console.log('');

  for (const [from, to] of moveMap) {
    console.log(
      `MOVE   ${path.relative(
        frontendRoot,
        from,
      )}`,
    );

    console.log(
      `    -> ${path.relative(
        frontendRoot,
        to,
      )}`,
    );
  }

  for (const file of resources.keys()) {
    console.log(
      `CREATE ${path.relative(
        frontendRoot,
        file,
      )}`,
    );
  }

  console.log('');
  console.log(
    'Dry run only. No files were changed.',
  );

  process.exit(0);
}

// ---------------------------------------------------------------------------
// Write TypeScript files
// ---------------------------------------------------------------------------
//
// New files are written before old paths are deleted. That reduces the
// chance of leaving the working tree half-migrated if a write fails.

for (const oldFile of tsFiles.map((file) =>
  path.resolve(file),
)) {
  const newFile =
    moveMap.get(oldFile) ?? oldFile;

  const next =
    finalTs.get(oldFile);

  const originalOnDisk =
    await fs.readFile(
      oldFile,
      'utf8',
    );

  if (
    newFile !== oldFile ||
    next !== originalOnDisk
  ) {
    await fs.mkdir(
      path.dirname(newFile),
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      newFile,
      next,
      'utf8',
    );
  }
}

// ---------------------------------------------------------------------------
// Write templates and stylesheets
// ---------------------------------------------------------------------------

for (const [file, content] of resources) {
  await fs.mkdir(
    path.dirname(file),
    {
      recursive: true,
    },
  );

  await fs.writeFile(
    file,
    content,
    'utf8',
  );
}

// ---------------------------------------------------------------------------
// Delete old TypeScript paths
// ---------------------------------------------------------------------------

for (const [oldFile, newFile] of moveMap) {
  if (oldFile !== newFile) {
    await fs.rm(oldFile);
  }
}

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------

console.log('');
console.log(
  `Converted ${converted} components.`,
);

console.log(
  `Moved/renamed ${movedCount} TypeScript files.`,
);

console.log(
  `Created ${resourceCount} HTML/SCSS files.`,
);

console.log('');
console.log(
  'Component class names were left unchanged.',
);

console.log(
  'Next: run npm test and npm run build.',
);
