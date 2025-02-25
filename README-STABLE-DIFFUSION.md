# Setting Up Stable Diffusion for Local Emoji Generation

This guide will help you set up Stable Diffusion WebUI locally to generate emojis without relying on external APIs like Replicate.

## Prerequisites

- Windows 10/11 with a compatible NVIDIA GPU (4GB+ VRAM recommended)
- Git installed on your system
- Python 3.10 installed on your system

## Step 1: Download Stable Diffusion WebUI

1. Open a command prompt or PowerShell window
2. Navigate to a directory where you want to install Stable Diffusion
3. Clone the repository:

```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
```

## Step 2: Download a Model

You need to download at least one model to use with Stable Diffusion. For emoji generation, we recommend:

1. **SDXL Base 1.0**: Great for high-quality images
   - Download from: [Hugging Face](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors)

2. **SD 1.5**: Faster generation, works well with less VRAM
   - Download from: [Hugging Face](https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors)

Place the downloaded model file in the `models/Stable-diffusion` folder within the WebUI directory.

## Step 3: Configure WebUI for API Access

1. Open the `webui-user.bat` file in a text editor
2. Find the line that starts with `set COMMANDLINE_ARGS=`
3. Modify it to include the API flag:

```
set COMMANDLINE_ARGS=--api
```

4. Save and close the file

## Step 4: Launch Stable Diffusion WebUI

1. Run the `webui-user.bat` file by double-clicking it
2. Wait for the initialization process to complete (this may take a few minutes the first time)
3. When ready, you'll see a message like:
   ```
   Running on local URL:  http://127.0.0.1:7860
   ```

4. Verify the WebUI is working by opening http://127.0.0.1:7860 in your browser

## Step 5: Test the API Connection

1. Make sure your Next.js app is running (`npm run dev`)
2. Try generating an emoji through your app's interface
3. Check the console logs to ensure the connection to the local API is successful

## Troubleshooting

### Connection Refused Error

If you see `ECONNREFUSED 127.0.0.1:7860`, it means:
- Stable Diffusion WebUI is not running
- It's running but not with the API flag enabled
- There's a firewall blocking the connection

Solutions:
1. Make sure WebUI is running (check for the terminal window)
2. Verify the `--api` flag is included in the command line arguments
3. Check your firewall settings

### Out of Memory Errors

If Stable Diffusion crashes with memory errors:

1. Edit `webui-user.bat` and add these flags:
   ```
   set COMMANDLINE_ARGS=--api --medvram --opt-split-attention
   ```

2. For very limited VRAM (4GB), use:
   ```
   set COMMANDLINE_ARGS=--api --lowvram --opt-split-attention
   ```

### Slow Generation

To speed up generation:
1. Use a smaller model (SD 1.5 instead of SDXL)
2. Reduce the number of steps (20-30 is often sufficient)
3. Use a faster sampler like "DPM++ 2M Karras"

## Optimizing for Emoji Generation

For best emoji results, try these settings in your API call:

```javascript
{
  prompt: `emoji style ${prompt}, simple, cute, minimal, solid color background, centered`,
  negative_prompt: "text, watermark, signature, blurry, low quality, realistic, photographic, photograph, multiple objects",
  width: 768, // Reduce if memory is an issue
  height: 768, // Reduce if memory is an issue
  steps: 25, // Good balance between quality and speed
  cfg_scale: 7.5,
  sampler_name: "DPM++ 2M Karras" // Faster than Euler a
}
```

## Keeping Stable Diffusion Running

To ensure Stable Diffusion is always available for your app:

1. Create a shortcut to `webui-user.bat` in your Windows startup folder
2. Or set up a Windows service to run it automatically

## Additional Resources

- [Stable Diffusion WebUI Documentation](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki)
- [Optimizing for Performance](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Optimizations)
- [Troubleshooting](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Troubleshooting) 