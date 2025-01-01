# AI Wallpaper Generator

This application automatically generates unique AI-created wallpapers daily using DALL-E 3, inspired by random words. Each wallpaper is saved along with information about what inspired its creation.

## Prerequisites

1. Node.js 18 or higher installed on your computer ([Download Here](https://nodejs.org/))
2. An OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))

## Installation

1. Download or clone this repository to your computer
2. Open a terminal/command prompt and navigate to the project folder
3. Install dependencies by running:

```bash
npm install
```

4. Create a file named `.env` in the project folder and add your OpenAI API key:

```plaintext
OPENAI_API_KEY=your-api-key-here
```

## Running Manually

To generate a new wallpaper manually, open a terminal in the project folder and run:

```bash
node index.js
```

## Setting Up Automatic Daily Runs

### On Windows:

1. Open Task Scheduler
2. Click "Create Basic Task"
3. Name it "AI Wallpaper Generator" and click Next
4. Select "Daily" and click Next
5. Choose your preferred time and click Next
6. Select "Start a program" and click Next
7. In "Program/script" enter: `node`
8. In "Add arguments" enter the full path to your index.js file
9. In "Start in" enter the full path to your project folder
10. Click Next and then Finish

### On Linux:

1. Open terminal and type `crontab -e`
2. Add this line (replace paths with your actual paths):
```bash
0 9 * * * cd /path/to/project && /usr/bin/node index.js
```
3. This will run it daily at 9 AM. Adjust the time as needed.
4. Save and exit

## What to Expect

- The program creates a folder called `daily_wallpaper` where it saves:
  - The generated wallpaper image (.png)
  - A text file with the random words and prompts used
- Your desktop wallpaper will automatically update with the new image
- If wallpaper setting fails, you can manually set it using the saved image in the `daily_wallpaper` folder

## Troubleshooting

- If you see "Error: Invalid API key", double check your `.env` file
- If wallpaper doesn't change automatically, set it manually from the `daily_wallpaper` folder
- Make sure you have write permissions in the project folder

## Note

This tool requires an OpenAI API key and will use your API credits. Each wallpaper generation typically costs about $0.08-$0.12 USD.
```
