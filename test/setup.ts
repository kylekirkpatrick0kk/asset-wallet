import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock global properties or plugins if needed
config.global.mocks = {
  $t: (msg: string) => msg,
};

// Mock global functions if needed
vi.mock('axios', () => ({
  get: vi.fn(),
}));