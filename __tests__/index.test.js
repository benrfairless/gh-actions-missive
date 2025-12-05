const { containsMissiveLink } = require('../src/index');

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warning: jest.fn(),
  setFailed: jest.fn()
}));

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
  context: {}
}));

describe('Missive Link Detection', () => {
  describe('containsMissiveLink', () => {
    test('should detect a valid Missive conversation link', () => {
      const comment = 'Missive conversation: https://mail.missiveapp.com/#inbox/conversations/1abc23-be16-b987-a123-cab31756ee47';
      expect(containsMissiveLink(comment)).toBe(true);
    });

    test('should detect Missive link in longer text', () => {
      const comment = 'This is related to Missive conversation: https://mail.missiveapp.com/#inbox/conversations/1abc23-be16-b987-a123-cab31756ee47 please check it out.';
      expect(containsMissiveLink(comment)).toBe(true);
    });

    test('should detect Missive link with different mailbox paths', () => {
      const comment = 'Check this: https://mail.missiveapp.com/#team-inbox/conversations/abc123-def456-ghi789';
      expect(containsMissiveLink(comment)).toBe(true);
    });

    test('should detect Missive link in multiline comment', () => {
      const comment = `Hello team,

Please review this issue.

Missive conversation: https://mail.missiveapp.com/#inbox/conversations/1abc23-be16-b987-a123-cab31756ee47

Thanks!`;
      expect(containsMissiveLink(comment)).toBe(true);
    });

    test('should return false for comments without Missive links', () => {
      const comment = 'This is a regular comment without any links';
      expect(containsMissiveLink(comment)).toBe(false);
    });

    test('should return false for other URLs', () => {
      const comment = 'Check this link: https://github.com/example/repo';
      expect(containsMissiveLink(comment)).toBe(false);
    });

    test('should return false for partial Missive URLs', () => {
      const comment = 'https://mail.missiveapp.com/#inbox';
      expect(containsMissiveLink(comment)).toBe(false);
    });

    test('should return false for null input', () => {
      expect(containsMissiveLink(null)).toBe(false);
    });

    test('should return false for undefined input', () => {
      expect(containsMissiveLink(undefined)).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(containsMissiveLink('')).toBe(false);
    });

    test('should detect multiple Missive links', () => {
      const comment = `First: https://mail.missiveapp.com/#inbox/conversations/abc123
Second: https://mail.missiveapp.com/#inbox/conversations/def456`;
      expect(containsMissiveLink(comment)).toBe(true);
    });
  });
});
