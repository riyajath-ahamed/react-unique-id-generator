# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| < 1.3   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.** Instead, please email the maintainer directly:

**Email:** riyajath.ahamed@gmail.com

### What to include

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes (if applicable)

### Response timeline

- **Acknowledgment:** Within 48 hours of your report
- **Initial assessment:** Within 1 week
- **Fix and release:** Depending on severity, typically within 2 weeks

### After a fix is released

- The vulnerability will be publicly disclosed in the changelog
- Credit will be given to the reporter (unless they prefer to remain anonymous)

## Security Best Practices

This library generates sequential IDs intended for DOM element identification (accessibility labels, form fields, etc.). These IDs are **not** designed for:

- Cryptographic purposes
- Authentication tokens
- Session identifiers
- Any security-sensitive context

If you need cryptographically secure random identifiers, use `crypto.randomUUID()` or a dedicated library instead.
