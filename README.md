# TypeScript NPM package starter template

A reusable template for instant and consistent TypeScript-based NPM packages.

## Using this boilerplate

### Option one: Repositories overview

Click on the **green `new` button** and select this boilerplate under `repository template`.

### Option two: Repository homepage

Click on the **green `use this template` button**.

## First use (initialisation)

### 1. Name your package

Change the `name` field in `package.json`

```json
{
    "name": "your-package-name-here"
}
```

### 2. Install packages

This template uses [PNPM](https://pnpm.io/) instead of NPM. Compatibility with regular NPM is not guaranteed and may require some tweaking.

```bash
pnpm install
```

### 3. Set first version (0.0.0 -> 1.0.0)

```bash
git commit -m "Initial commit"
pnpm version major
```

### 4. Publish the first version of your package

```bash
pnpm publish
```

## Testing changes locally

Run the pack command:

```shell
pnpm pack
```

This generates an tarball file (.tgz), installable in any (p)npm project

```shell
pnpm add ./nyce-software-ts-core-[VERSION].tgz
```

## Publishing future versions

**Important notice:** A version number change and a push of commits is automatically triggered by the mentioned (p)npm commands.
Please do not perform these actions manually.

### Commit

Commit your changes, **NOTE: do not mention/commit version numbers manually**

```shell
git commit -m "DESCRIBE_YOUR_CHANGES_HERE"
```

### Version

Run the version command, specify the type of the change (semantic versioning):

```shell
pnpm version [patch|minor|major]
```

### Publish

Run the publish command:

```shell
pnpm publish
```
