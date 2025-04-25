# ImaginAI - Image Generation and Editing

This application allows users to generate images from text descriptions and edit existing images using AI.

## Features

- Text to image generation
- Prompt to edit existing images
- Download generated and edited images
- Save images to your gallery
- Responsive design for desktop and mobile

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the client directory with your API keys:
   ```
   VITE_STABILITY_API_KEY=your_stability_ai_api_key_here
   VITE_REPLICATE_API_KEY=your_replicate_api_key_here
   ```
4. Start the development server:
   ```
   npm start
   ```

## How to Use

### Text to Image
1. Log in to your account
2. Click on "Text to Image" in the navigation bar
3. Enter a detailed description of the image you want to generate
4. Click "Generate Image"
5. Once the image is generated, you can download it or it will be automatically saved to your gallery

### Prompt to Edit
1. Log in to your account
2. Click on "Prompt to Edit" in the navigation bar
3. Upload an image you want to edit
4. Enter a prompt describing how you want to edit the image
5. Click "Edit Image"
6. Once the image is edited, you can download it or it will be automatically saved to your gallery

## API Keys

To use the features, you need API keys:

### Stability AI API Key
1. Go to [Stability AI](https://stability.ai/)
2. Create an account
3. Generate an API key

### Replicate API Key
1. Go to [Replicate](https://replicate.com/)
2. Create an account
3. Generate an API key from your account settings

## Notes

- The image generation and editing processes may take a few seconds to complete
- The quality of the results depends on the prompts you provide
- Be specific and detailed in your prompts for better results
