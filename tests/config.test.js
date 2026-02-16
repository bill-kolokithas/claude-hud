import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, getConfigPath } from '../dist/config.js';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import * as os from 'node:os';

async function createTempHome() {
  return await mkdtemp(path.join(tmpdir(), 'claude-hud-config-'));
}

test('loadConfig returns valid config structure', async () => {
  const config = await loadConfig();

  // pathLevels must be 1, 2, or 3
  assert.ok([1, 2, 3].includes(config.pathLevels), 'pathLevels should be 1, 2, or 3');

  // lineLayout must be valid
  const validLineLayouts = ['compact', 'expanded'];
  assert.ok(validLineLayouts.includes(config.lineLayout), 'lineLayout should be valid');

  // showSeparators must be boolean
  assert.equal(typeof config.showSeparators, 'boolean', 'showSeparators should be boolean');

  // gitStatus object with expected properties
  assert.equal(typeof config.gitStatus, 'object');
  assert.equal(typeof config.gitStatus.enabled, 'boolean');
  assert.equal(typeof config.gitStatus.showDirty, 'boolean');
  assert.equal(typeof config.gitStatus.showAheadBehind, 'boolean');

  // display object with expected properties
  assert.equal(typeof config.display, 'object');
  assert.equal(typeof config.display.showModel, 'boolean');
  assert.equal(typeof config.display.showContextBar, 'boolean');
  assert.ok(['percent', 'tokens'].includes(config.display.contextValue), 'contextValue should be valid');
  assert.equal(typeof config.display.showConfigCounts, 'boolean');
  assert.equal(typeof config.display.showDuration, 'boolean');
  assert.equal(typeof config.display.showSpeed, 'boolean');
  assert.equal(typeof config.display.showTokenBreakdown, 'boolean');
  assert.equal(typeof config.display.showUsage, 'boolean');
  assert.equal(typeof config.display.showTools, 'boolean');
  assert.equal(typeof config.display.showAgents, 'boolean');
  assert.equal(typeof config.display.showTodos, 'boolean');
});

test('getConfigPath returns correct path', () => {
  const originalEnv = process.env.CLAUDE_CONFIG_DIR;
  try {
    // Clear env var to test default behavior
    delete process.env.CLAUDE_CONFIG_DIR;

    const configPath = getConfigPath();
    const homeDir = os.homedir();
    assert.equal(configPath, path.join(homeDir, '.claude', 'plugins', 'claude-hud', 'config.json'));
  } finally {
    if (originalEnv === undefined) {
      delete process.env.CLAUDE_CONFIG_DIR;
    } else {
      process.env.CLAUDE_CONFIG_DIR = originalEnv;
    }
  }
});

test('loads config from CLAUDE_CONFIG_DIR when set', async () => {
  const customHome = await createTempHome();
  const originalEnv = process.env.CLAUDE_CONFIG_DIR;

  try {
    process.env.CLAUDE_CONFIG_DIR = customHome;

    // Create custom config
    const configDir = path.join(customHome, 'plugins', 'claude-hud');
    await mkdir(configDir, { recursive: true });
    await writeFile(
      path.join(configDir, 'config.json'),
      JSON.stringify({ pathLevels: 3 }),
      'utf8'
    );

    const config = await loadConfig();
    assert.equal(config.pathLevels, 3);
  } finally {
    if (originalEnv === undefined) {
      delete process.env.CLAUDE_CONFIG_DIR;
    } else {
      process.env.CLAUDE_CONFIG_DIR = originalEnv;
    }
    await rm(customHome, { recursive: true, force: true });
  }
});
