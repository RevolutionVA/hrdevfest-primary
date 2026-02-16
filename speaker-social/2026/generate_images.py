#!/usr/bin/env python3
"""
HRDevFest 2026 Social Media Image Generator
Uses Google Gemini/Imagen API to generate creative images for the content calendar.
"""

import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

# Configuration
API_KEY = "AIzaSyC0dsd5nSG2ySi4JLrviN1nBoEFEwBHdqo"
OUTPUT_DIR = Path(__file__).parent / "generated"

# Brand colors and style guidelines for prompts
BRAND_STYLE = """
Style: Modern tech conference promotional image.
Colors: Teal/cyan accent (#00B4D8), dark gray text, white/light backgrounds.
Vibe: Professional yet approachable, community-focused, developer culture.
Location: Virginia Beach, Hampton Roads area.
Event: Hampton Roads DevFest 2026, February 27, 2026.
"""

# Image prompts organized by category
IMAGE_PROMPTS = {
    # Countdown/General Posts (6)
    "feb01-countdown-1month": {
        "prompt": f"Create a tech conference countdown promotional image. Show '1 MONTH' in large bold typography with calendar graphics, rocket launching upward, excitement and anticipation. {BRAND_STYLE}",
        "category": "countdown"
    },
    "feb11-countdown-3weeks": {
        "prompt": f"Create a tech conference countdown image. Show '3 WEEKS' prominently with clock/calendar elements, building excitement. Incorporate subtle beach/coastal elements for Virginia Beach vibe. {BRAND_STYLE}",
        "category": "countdown"
    },
    "feb16-countdown-2weeks": {
        "prompt": f"Create a tech conference countdown image. Show '2 WEEKS' in bold typography, tickets flying, energy building. Developer community gathering concept. {BRAND_STYLE}",
        "category": "countdown"
    },
    "feb23-countdown-1week": {
        "prompt": f"Create an urgent tech conference countdown image. Show '1 WEEK' or '7 DAYS' with fire/heat emojis concept, maximum excitement, final push energy. {BRAND_STYLE}",
        "category": "countdown"
    },
    "feb26-countdown-tomorrow": {
        "prompt": f"Create a 'TOMORROW IS THE DAY' tech conference image. Celebration, confetti, excitement, doors opening concept. Maximum hype energy. {BRAND_STYLE}",
        "category": "countdown"
    },

    # Sponsor Posts (4)
    "feb02-sponsor-platinum-vb": {
        "prompt": f"Create a sponsor appreciation image for a city government platinum sponsor. Show gratitude, partnership, Virginia Beach cityscape silhouette, community support theme. Thank you message concept. {BRAND_STYLE}",
        "category": "sponsor"
    },
    "feb07-sponsor-gold-telerik": {
        "prompt": f"Create a sponsor appreciation image for a developer tools company (gold sponsor). Show software development tools, code symbols, partnership gratitude. Professional tech aesthetic. {BRAND_STYLE}",
        "category": "sponsor"
    },
    "feb09-sponsor-gold-stigian": {
        "prompt": f"Create a sponsor appreciation image for a local consulting firm (gold sponsor). Show professional partnership, local business support, community collaboration. {BRAND_STYLE}",
        "category": "sponsor"
    },
    "feb15-sponsor-silver-duo": {
        "prompt": f"Create a sponsor appreciation image featuring two silver sponsors together. Show partnership, collaboration, supporting local tech community. Dual spotlight concept. {BRAND_STYLE}",
        "category": "sponsor"
    },
    "feb22-sponsor-silver-trio": {
        "prompt": f"Create a sponsor appreciation image featuring three silver sponsors. Show community support, multiple partners working together, gratitude theme. {BRAND_STYLE}",
        "category": "sponsor"
    },

    # Throwback Posts (6) - 2024 event photos style
    "feb04-throwback-sql": {
        "prompt": f"Create a throwback/nostalgic tech conference image. Theme: SQL database query optimization session. Show database diagrams, execution plans, speaker presenting. Nostalgic purple/vintage filter. {BRAND_STYLE}",
        "category": "throwback"
    },
    "feb08-throwback-genai": {
        "prompt": f"Create a throwback tech conference image. Theme: Generative AI discussion session. Show AI concepts, neural networks, speaker engaging audience. Thoughtful, forward-looking but retrospective. {BRAND_STYLE}",
        "category": "throwback"
    },
    "feb13-throwback-career": {
        "prompt": f"Create a throwback tech conference image. Theme: Career development session about job hunting. Show resume concepts, interview success, professional growth. Warm, encouraging feel. {BRAND_STYLE}",
        "category": "throwback"
    },
    "feb17-throwback-security": {
        "prompt": f"Create a throwback tech conference image. Theme: Web application security session. Show locks, shields, code security concepts. Serious but educational tone. {BRAND_STYLE}",
        "category": "throwback"
    },
    "feb20-throwback-lowcode": {
        "prompt": f"Create a throwback tech conference image. Theme: Low-code solutions at a national lab. Show scientific/research setting, drag-and-drop interface concepts. Innovation meets accessibility. {BRAND_STYLE}",
        "category": "throwback"
    },
    "feb24-throwback-copilot": {
        "prompt": f"Create a throwback tech conference image. Theme: AI coding assistants/copilots evolution. Show developer with AI assistant concept, pair programming with AI. Forward-looking retrospective. {BRAND_STYLE}",
        "category": "throwback"
    },

    # Swag Posts (4)
    "feb05-swag-launch": {
        "prompt": f"Create a merchandise launch promotional image. Show t-shirts, hoodies, sweatshirts floating/displayed attractively. 'SWAG STORE NOW OPEN' concept. Excitement, fresh merch energy. {BRAND_STYLE}",
        "category": "swag"
    },
    "feb12-swag-hoodie": {
        "prompt": f"Create a cozy hoodie promotional image for a tech conference. Show warm pullover hoodie, perfect for coding sessions, winter comfort. Lifestyle product shot concept. {BRAND_STYLE}",
        "category": "swag"
    },
    "feb19-swag-gift": {
        "prompt": f"Create a 'perfect gift for developers' promotional image. Show gift-wrapped merchandise, giving concept, making developers happy. Thoughtful gift idea theme. {BRAND_STYLE}",
        "category": "swag"
    },
    "feb25-swag-lastchance": {
        "prompt": f"Create an urgent 'LAST CHANCE' merchandise promotional image. Show clock running out, merchandise flying off shelves, urgency to order before event. FOMO energy. {BRAND_STYLE}",
        "category": "swag"
    },
}


def initialize_client():
    """Initialize the Gemini client."""
    client = genai.Client(api_key=API_KEY)
    return client


def generate_image(client, prompt: str, output_path: Path) -> bool:
    """Generate a single image using Imagen model."""
    try:
        # Use Imagen 4 for image generation
        response = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",  # Square for social media
                safety_filter_level="BLOCK_LOW_AND_ABOVE",
            )
        )

        if response.generated_images:
            image = response.generated_images[0]
            # Save the image
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(image.image.image_bytes)
            print(f"  Generated: {output_path.name}")
            return True
        else:
            print(f"  No image generated for {output_path.name}")
            return False

    except Exception as e:
        print(f"  Error generating {output_path.name}: {e}")
        return False


def generate_sample_images(client):
    """Generate one sample image from each category for approval."""
    samples = {
        "countdown": "feb01-countdown-1month",
        "sponsor": "feb02-sponsor-platinum-vb",
        "throwback": "feb04-throwback-sql",
        "swag": "feb05-swag-launch",
    }

    print("\n=== Generating Sample Images (1 per category) ===\n")

    for category, key in samples.items():
        prompt_data = IMAGE_PROMPTS[key]
        output_path = OUTPUT_DIR / f"{key}.png"
        print(f"Category: {category.upper()}")
        generate_image(client, prompt_data["prompt"], output_path)
        print()

    print("Sample generation complete. Review images in generated/ folder.")


def generate_all_images(client):
    """Generate all remaining images."""
    print("\n=== Generating All Images ===\n")

    success_count = 0
    fail_count = 0

    for key, prompt_data in IMAGE_PROMPTS.items():
        output_path = OUTPUT_DIR / f"{key}.png"

        # Skip if already exists
        if output_path.exists():
            print(f"  Skipping (exists): {key}")
            continue

        print(f"Generating: {key} ({prompt_data['category']})")
        if generate_image(client, prompt_data["prompt"], output_path):
            success_count += 1
        else:
            fail_count += 1

    print(f"\n=== Complete ===")
    print(f"Success: {success_count}, Failed: {fail_count}")


def main():
    """Main entry point."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if len(sys.argv) > 1 and sys.argv[1] == "--all":
        mode = "all"
    else:
        mode = "sample"

    print("HRDevFest 2026 Social Media Image Generator")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Mode: {mode}")

    client = initialize_client()

    if mode == "sample":
        generate_sample_images(client)
        print("\nTo generate all images, run: python generate_images.py --all")
    else:
        generate_all_images(client)


if __name__ == "__main__":
    main()
