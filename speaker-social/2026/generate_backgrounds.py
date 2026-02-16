#!/usr/bin/env python3
"""
HRDevFest 2026 Background Generator
Uses Google AI Studio (Imagen) to generate event-themed backgrounds.
Text and logos are composited separately using PIL for accuracy.
"""

from pathlib import Path
from google import genai
from google.genai import types

# Configuration
API_KEY = "AIzaSyC0dsd5nSG2ySi4JLrviN1nBoEFEwBHdqo"
BASE_DIR = Path(__file__).parent
BACKGROUNDS_DIR = BASE_DIR / "backgrounds"

# Background prompts - NO text, NO logos, just visual themes
BACKGROUND_PROMPTS = {
    # Countdown backgrounds - exciting, tech conference energy
    "countdown-1month": "Modern tech conference promotional background, teal and white gradient, abstract geometric network pattern with glowing nodes, professional corporate event atmosphere, no text no logos, clean minimalist design",

    "countdown-3weeks": "Tech conference countdown background, dynamic swooping lines in teal and cyan, subtle circuit board pattern, excitement energy, Virginia Beach coastal subtle hints, no text no logos",

    "countdown-2weeks": "Urgent tech event background, bold teal gradient with light rays, abstract digital particles floating, modern conference hall ambiance, no text no logos, energetic feel",

    "countdown-1week": "High energy tech conference background, vibrant teal and orange accents, abstract speed lines and geometric shapes, final countdown excitement, no text no logos",

    "countdown-tomorrow": "Celebration tech event background, confetti particles, teal and gold accents, theater curtains hint, grand opening energy, no text no logos, festive atmosphere",

    # Sponsor backgrounds - professional gratitude theme
    "sponsor-platinum": "Premium sponsor appreciation background, elegant teal and silver gradient, subtle geometric patterns, professional corporate partnership theme, no text no logos, prestigious feel",

    "sponsor-gold": "Gold tier sponsor background, warm teal and gold tones, professional gratitude theme, subtle abstract waves, corporate partnership aesthetic, no text no logos",

    "sponsor-silver": "Silver sponsor appreciation background, cool teal and silver tones, modern geometric pattern, community partnership theme, no text no logos, professional clean design",

    # Swag backgrounds - merchandise/retail feel
    "swag-store": "Tech merchandise store background, teal accent colors, modern retail display aesthetic, developer swag theme, hoodie and t-shirt shopping vibe, no text no logos, clean product showcase feel",

    "swag-hoodie": "Cozy developer hoodie promotional background, warm teal tones, winter coding session vibes, soft comfortable aesthetic, no text no logos, lifestyle product feel",

    "swag-gift": "Gift giving promotional background, teal and white with subtle gift wrap patterns, developer appreciation theme, thoughtful present aesthetic, no text no logos",

    "swag-lastchance": "Urgent sale background, bold teal with timer/clock abstract elements, last chance shopping energy, merchandise clearance feel, no text no logos, urgency theme",
}


def initialize_client():
    """Initialize the Gemini client."""
    return genai.Client(api_key=API_KEY)


def generate_background(client, prompt: str, output_path: Path, aspect_ratio: str = "1:1") -> bool:
    """Generate a single background image using Imagen."""
    try:
        response = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio=aspect_ratio,
                safety_filter_level="BLOCK_LOW_AND_ABOVE",
            )
        )

        if response.generated_images:
            image = response.generated_images[0]
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(image.image.image_bytes)
            print(f"  [OK] Generated: {output_path.name}")
            return True
        else:
            print(f"  [SKIP] No image generated for {output_path.name}")
            return False

    except Exception as e:
        print(f"  [ERR] Error: {e}")
        return False


def main():
    """Generate all background images."""
    BACKGROUNDS_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("Hampton Roads DevFest 2026 Background Generator")
    print("Using Google AI Studio (Imagen)")
    print("=" * 60)

    client = initialize_client()

    # Generate each background in both square and landscape
    for name, prompt in BACKGROUND_PROMPTS.items():
        print(f"\n{name}:")

        # Square (1:1) for universal use
        square_path = BACKGROUNDS_DIR / f"{name}-square.png"
        if not square_path.exists():
            generate_background(client, prompt, square_path, "1:1")
        else:
            print(f"  (skipping square - exists)")

        # Landscape (16:9) for X, LinkedIn, Bluesky
        landscape_path = BACKGROUNDS_DIR / f"{name}-landscape.png"
        if not landscape_path.exists():
            generate_background(client, prompt, landscape_path, "16:9")
        else:
            print(f"  (skipping landscape - exists)")

    print("\n" + "=" * 60)
    print("Background generation complete!")
    print(f"Output: {BACKGROUNDS_DIR}")
    print("\nNext: Run create_social_images.py to composite text and logos")


if __name__ == "__main__":
    main()
