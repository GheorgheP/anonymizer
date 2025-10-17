# Anonymizer

Anonymizer is a browser extension for anonymizing emails addresses that were submitted by mistake to Chat GPT.

## Requirements
- You need to have Node.js installed.
- Pnpm package manager is required.

## Prerequests
Install the dependencies
```bash
pnpm install 
```


## Run the extension
To run the extension you need to build it first.
Depending on the platform ou want to run there are different commands.
For Chrome:
```bash 
pnpm run build:chrome 
```

For Firefox:
```bash 
pnpm run build:firefox 
```

For both:
```bash 
pnpm run build 
```

You cna find the builds in the `dist` folder.
There will be 2 folders for each platform: `chrome` and `firefox`.`
Load the packages in the desired browser as an unpacked extension.
