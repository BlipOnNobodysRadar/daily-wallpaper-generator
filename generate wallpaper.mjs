import 'dotenv/config';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { setWallpaper } from 'wallpaper';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('stuff is happening')

const generateDallePrompt = async (prompt) => {
  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const data = {
    model: 'gpt-4-1106-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates detailed and creative image prompts for DALL-E 3.',
      },
      {
        role: 'user',
        content: `Construct a prompt to DALL-E 3 that creates a unique image from these random words: ${prompt}. Answer with only the prompt.`,
      },
    ],
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
    const generatedPrompt = response.data.choices[0].message.content.trim();
    console.log('GPT-4 Turbo generated prompt:', generatedPrompt);
    return generatedPrompt;
  } catch (error) {
    console.error('Error generating DALL-E prompt:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const generateImage = async (prompt) => {
  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const data = {
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024",
    response_format: "b64_json",
    quality: "hd"
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const run = async () => {
  try {
    console.log('Starting wallpaper generation...');
    
    // Create daily_wallpaper directory in the project directory
    const dirPath = path.join(__dirname, 'daily_wallpaper');
    await fs.mkdir(dirPath, { recursive: true });
    console.log('Directory created/verified');

    // Get random words and format them
    console.log('Fetching random words...');
    const wordsResponse = await axios.get('https://random-word-api.herokuapp.com/word?number=5');
    const words = wordsResponse.data;
    const wordsString = words.join(' ');
    console.log('Random words:', wordsString);

    // Generate DALL-E prompt
    const dallePrompt = await generateDallePrompt(wordsString);
    console.log('Generated prompt:', dallePrompt);

    // Generate image
    const imageData = await generateImage(dallePrompt);
    const base64Data = imageData.data[0].b64_json;
    const revisedPrompt = imageData.data[0].revised_prompt || dallePrompt;

    // Generate timestamp for filenames
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const imageName = `wallpaper_${timestamp}.png`;
    const infoName = `wallpaper_${timestamp}_info.txt`;

    // Save image
    const imagePath = path.join(dirPath, imageName);
    await fs.writeFile(imagePath, base64Data, 'base64');
    console.log(`Image saved: ${imagePath}`);

    // Save information file with words, prompt, and revised prompt
    const infoContent = `Random Words: ${wordsString}
Generated Prompt: ${dallePrompt}
Final DALL-E Prompt: ${revisedPrompt}`;

    const infoPath = path.join(dirPath, infoName);
    await fs.writeFile(infoPath, infoContent, 'utf8');
    console.log(`Info saved: ${infoPath}`);

    // Set wallpaper
    try {
      await setWallpaper(imagePath);
      console.log('Wallpaper set successfully!');
    } catch (error) {
      console.error('Error setting wallpaper:', error);
      console.log('Manual wallpaper path:', imagePath);
    }

  } catch (error) {
    console.error('Failed to generate daily image:', error.message);
    if (error.response) {
      console.error('API Response Error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
  }
};

run();