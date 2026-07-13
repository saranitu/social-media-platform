# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please email security@socialhubplatform.com instead of using the issue tracker.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

## Security Best Practices

### For Developers
- Always validate user input
- Use HTTPS in production
- Keep dependencies updated
- Never commit secrets
- Use environment variables for sensitive data
- Implement rate limiting
- Enable CORS properly

### For Users
- Use strong passwords
- Enable 2FA if available
- Don't share your unique code
- Report suspicious activity

## Supported Versions

| Version | Supported |
|---------|----------|
| 1.x     | Yes      |
| 0.x     | No       |

## Dependencies

We regularly update dependencies to patch security vulnerabilities.

Run `npm audit` to check for vulnerabilities.
