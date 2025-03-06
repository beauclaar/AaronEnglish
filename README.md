# Aaron English

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Security Updates

```sh
# Check for vulnerabilities
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# Fix all vulnerabilities (may include breaking changes)
npm audit fix --force
```

If vulnerabilities persist after running these commands, review the detailed audit report and update specific packages manually:

```sh
# Update a specific package
npm update <package-name>

# Install latest version of a package
npm install <package-name>@latest
```

For production deployments, always run security audits first:
```sh
npm audit
npm audit fix
```
