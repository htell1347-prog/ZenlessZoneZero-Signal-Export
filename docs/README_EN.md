# Zenless Zone Zero Signal Export Tool

[中文](https://github.com/htell1347-prog/ZenlessZoneZero-Signal-Export/blob/master/README.md) | English

This project is based on [genshin-wish-export](https://github.com/biuuu/genshin-wish-export), with basically the same functionality.

A small tool built with Electron, designed to run on Windows 64-bit operating systems.

It obtains the authKey needed to access the game's signal history API by reading game logs or using proxy mode, then uses that authKey to retrieve the signal history.

The tool saves data in the `userData` folder in the current directory. New signal history will be merged with local data before saving.

## Other Languages

Modify the JSON files in the `src/i18n/` directory to translate into other languages. Translations were done using DeepSeek V4 Pro — if you find any existing translations inaccurate or improvable, feel free to submit a pull request.

## Usage

1. Download and unzip the tool - Download: [GitHub](https://github.com/htell1347-prog/ZenlessZoneZero-Signal-Export/releases/latest/download/ZenlessZoneZero-Signal-Export.zip)

2. Open the game's signal history

   ![signal History](/docs/signal-history.png)

3. Click the tool's "Load Data" button

   ![Load Data](/docs/load-data.png)

   If everything goes well, you will see a prompt indicating data is being loaded. The final result looks like this:

   <details>
   <summary>Expand image</summary>

   ![Preview](/docs/preview.png)

   </details>

If you need to export data for multiple accounts, click the plus button next to it.

Then switch to a different account in the game, open the signal history again, and click the "Load Data" button in the tool.

## Development

```
# Install dependencies
yarn install

# Development mode
yarn dev

# Build a distributable application
yarn build
```

## License

[MIT](https://github.com/htell1347-prog/ZenlessZoneZero-Signal-Export/blob/master/LICENSE)
