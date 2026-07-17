#!/bin/bash
set -e

# Install npm
npm install -g npm@latest && npm install -g typescript @types/node @types/react @testing-library/react jest
# Install claude code npm for cline ext
npm install -g @anthropic-ai/claude-code
# Explicitly run postinstall to ensure native binary is downloaded
node $(npm root -g)/@anthropic-ai/claude-code/install.cjs

