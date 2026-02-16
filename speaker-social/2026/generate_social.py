#!/usr/bin/env python3
"""
HRDevFest 2026 Social Media Image Generator

A flexible CLI tool for generating social media images using a consistent
background template with customizable content.

Modes:
  speaker  - Speaker announcement with circular photo + name + title
  sponsor  - Sponsor appreciation with logo
  custom   - AI-generated content using Gemini (requires GEMINI_API_KEY)
  batch    - Process multiple items from JSON file

Usage:
  python generate_social.py speaker --name "Lionel Sapp" --title "Founder, Digital Builders" --photo "LionelSapp.jpeg"
  python generate_social.py sponsor --name "City of Virginia Beach" --logo "cvb.png" --tier "Platinum"
  python generate_social.py custom --prompt "Create a 'TICKETS ON SALE' announcement"
  python generate_social.py batch --file speakers.json --type speaker
"""

import argparse
import json
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Paths
BASE_DIR = Path(__file__).parent
PROJECT_ROOT = BASE_DIR.parent.parent
ASSETS_DIR = PROJECT_ROOT / "src" / "assets"
SPONSORS_DIR = ASSETS_DIR / "sponsors"
TEMPLATE_PATH = BASE_DIR / "base.png"
OUTPUT_DIR = BASE_DIR / "generated"

# Brand colors (from HRDevFest branding)
TEAL = (0, 180, 216)       # #00B4D8
DARK_TEAL = (72, 111, 122) # #486F7A
ORANGE = (217, 83, 30)     # #D9531E (from base.png name color)
DARK_GRAY = (51, 51, 51)   # #333333
WHITE = (255, 255, 255)
LIGHT_GRAY = (245, 245, 245)

# Image dimensions
SIZE_SQUARE = (1080, 1080)
SIZE_LANDSCAPE = (1200, 630)

# Brand constants
BRAND_NAME = "Hampton Roads DevFest"
EVENT_DATE = "February 27, 2026"
EVENT_LOCATION = "Virginia Beach, VA"
WEBSITE = "hrdevfest.org"


def get_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    """Get a font, falling back to default if custom fonts unavailable."""
    try:
        if bold:
            return ImageFont.truetype("arialbd.ttf", size)
        return ImageFont.truetype("arial.ttf", size)
    except:
        try:
            if bold:
                return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
            return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
        except:
            return ImageFont.load_default()


def load_base_image(size: tuple) -> Image.Image:
    """Load base.png and resize/crop to target dimensions."""
    if not TEMPLATE_PATH.exists():
        print(f"  [WARN] Template not found: {TEMPLATE_PATH}")
        # Fallback to gradient
        img = Image.new('RGB', size, LIGHT_GRAY)
        return img

    template = Image.open(TEMPLATE_PATH).convert("RGB")

    # Crop to target aspect ratio
    target_ratio = size[0] / size[1]
    template_ratio = template.width / template.height

    if template_ratio > target_ratio:
        # Template is wider - crop sides
        new_width = int(template.height * target_ratio)
        left = (template.width - new_width) // 2
        template = template.crop((left, 0, left + new_width, template.height))
    else:
        # Template is taller - crop top/bottom
        new_height = int(template.width / target_ratio)
        top = (template.height - new_height) // 2
        template = template.crop((0, top, template.width, top + new_height))

    template = template.resize(size, Image.Resampling.LANCZOS)
    return template


def create_circular_photo(photo_path: Path, diameter: int) -> Image.Image:
    """Create a circular cropped photo with white border."""
    if not photo_path.exists():
        # Return placeholder circle
        img = Image.new('RGBA', (diameter, diameter), (200, 200, 200, 255))
        return img

    photo = Image.open(photo_path).convert("RGBA")

    # Auto-rotate based on EXIF
    try:
        from PIL import ExifTags
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        exif = photo._getexif()
        if exif:
            orientation_value = exif.get(orientation)
            if orientation_value == 3:
                photo = photo.rotate(180, expand=True)
            elif orientation_value == 6:
                photo = photo.rotate(270, expand=True)
            elif orientation_value == 8:
                photo = photo.rotate(90, expand=True)
    except:
        pass

    # Crop to square (center crop)
    min_dim = min(photo.width, photo.height)
    left = (photo.width - min_dim) // 2
    top = (photo.height - min_dim) // 2
    photo = photo.crop((left, top, left + min_dim, top + min_dim))

    # Resize to diameter
    photo = photo.resize((diameter, diameter), Image.Resampling.LANCZOS)

    # Create circular mask
    mask = Image.new('L', (diameter, diameter), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, diameter, diameter), fill=255)

    # Apply mask
    output = Image.new('RGBA', (diameter, diameter), (0, 0, 0, 0))
    output.paste(photo, (0, 0))
    output.putalpha(mask)

    # Add white border
    border_width = int(diameter * 0.03)
    bordered = Image.new('RGBA', (diameter + border_width * 2, diameter + border_width * 2), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(bordered)
    border_draw.ellipse((0, 0, diameter + border_width * 2, diameter + border_width * 2), fill=WHITE)
    bordered.paste(output, (border_width, border_width), output)

    return bordered


def create_speaker_image(name: str, title: str, photo_path: Path, output_name: str,
                         formats: list = None) -> list:
    """
    Create a speaker announcement image.

    Layout based on base.png template:
    - Circular photo on the left
    - "SPEAKER" label above name
    - Name in large orange text
    - Title below name
    - Event info at bottom
    """
    if formats is None:
        formats = ["square", "landscape"]

    output_files = []
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for fmt in formats:
        if fmt == "square":
            size = SIZE_SQUARE
            suffix = "-square"
        else:
            size = SIZE_LANDSCAPE
            suffix = "-landscape"

        is_landscape = (fmt == "landscape")
        font_scale = 0.85 if is_landscape else 1.0

        # Load base template
        img = load_base_image(size)
        img = img.convert('RGBA')

        # Add semi-transparent white overlay for text area
        overlay = Image.new('RGBA', size, (255, 255, 255, 200))
        img = Image.alpha_composite(img, overlay)

        draw = ImageDraw.Draw(img)

        # Photo dimensions and position
        if is_landscape:
            photo_diameter = 200
            photo_x = 80
            photo_y = (size[1] - photo_diameter - 20) // 2
            text_x = photo_x + photo_diameter + 60
        else:
            photo_diameter = 280
            photo_x = 80
            photo_y = 260
            text_x = photo_x + photo_diameter + 40

        # Add circular photo
        circular_photo = create_circular_photo(photo_path, photo_diameter)
        img.paste(circular_photo, (photo_x, photo_y), circular_photo)

        # Text positioning
        text_y = photo_y + 10

        # "SPEAKER" label
        font_label = get_font(int(24 * font_scale), bold=True)
        draw.text((text_x, text_y), "SPEAKER", fill=DARK_GRAY, font=font_label)
        text_y += 35

        # Speaker name (large, orange, uppercase)
        # Split name into parts if needed
        name_parts = name.upper().split()
        font_name = get_font(int(56 * font_scale), bold=True)

        for part in name_parts:
            draw.text((text_x, text_y), part, fill=ORANGE, font=font_name)
            text_y += int(60 * font_scale)

        # Title
        text_y += 5
        font_title = get_font(int(22 * font_scale), bold=True)
        draw.text((text_x, text_y), title, fill=DARK_GRAY, font=font_title)

        # Event info at bottom
        info_y = size[1] - 140 if is_landscape else size[1] - 180
        font_info = get_font(int(20 * font_scale), bold=True)

        draw.text((80, info_y), BRAND_NAME.upper(), fill=DARK_GRAY, font=font_info)
        draw.text((80, info_y + 28), EVENT_DATE.upper(), fill=DARK_GRAY, font=font_info)
        draw.text((80, info_y + 56), f"REGISTER NOW: {WEBSITE.upper()}", fill=DARK_GRAY, font=font_info)

        # Add HRDevFest logo in bottom right
        logo_path = ASSETS_DIR / "logo.png"
        if logo_path.exists():
            logo = Image.open(logo_path).convert("RGBA")
            logo_height = 80 if is_landscape else 100
            ratio = logo_height / logo.height
            logo_width = int(logo.width * ratio)
            logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
            logo_x = size[0] - logo_width - 40
            logo_y = size[1] - logo_height - 40
            img.paste(logo, (logo_x, logo_y), logo)

        # Save
        output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
        img.convert('RGB').save(output_path, quality=95)
        output_files.append(output_path)
        print(f"  Created: {output_path.name}")

    return output_files


def create_sponsor_image(name: str, logo_path: Path, tier: str, output_name: str,
                         formats: list = None) -> list:
    """Create a sponsor appreciation image with logo."""
    if formats is None:
        formats = ["square", "landscape"]

    output_files = []
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for fmt in formats:
        if fmt == "square":
            size = SIZE_SQUARE
            suffix = "-square"
        else:
            size = SIZE_LANDSCAPE
            suffix = "-landscape"

        is_landscape = (fmt == "landscape")
        font_scale = 0.85 if is_landscape else 1.0

        # Load base template
        img = load_base_image(size)
        img = img.convert('RGBA')

        # Add semi-transparent white overlay
        overlay = Image.new('RGBA', size, (255, 255, 255, 220))
        img = Image.alpha_composite(img, overlay)

        draw = ImageDraw.Draw(img)

        # Decorative top bar
        draw.rectangle([(0, 0), (size[0], 6)], fill=TEAL)

        # "THANK YOU" header
        font_header = get_font(int(48 * font_scale), bold=True)
        header_text = "THANK YOU"
        bbox = draw.textbbox((0, 0), header_text, font=font_header)
        header_width = bbox[2] - bbox[0]
        header_y = 50 if is_landscape else 80
        draw.text(((size[0] - header_width) // 2, header_y), header_text, fill=TEAL, font=font_header)

        # Tier badge
        font_tier = get_font(int(28 * font_scale))
        tier_text = f"{tier} Sponsor"
        bbox = draw.textbbox((0, 0), tier_text, font=font_tier)
        tier_width = bbox[2] - bbox[0]
        badge_y = header_y + 65
        badge_x = (size[0] - tier_width) // 2 - 16

        draw.rounded_rectangle(
            [(badge_x, badge_y), (badge_x + tier_width + 32, badge_y + 44)],
            radius=22, fill=TEAL
        )
        draw.text(((size[0] - tier_width) // 2, badge_y + 8), tier_text, fill=WHITE, font=font_tier)

        # Sponsor logo
        if logo_path.exists():
            sponsor_logo = Image.open(logo_path).convert("RGBA")

            if is_landscape:
                max_width, max_height = 400, 150
                logo_y = badge_y + 80
            else:
                max_width, max_height = 500, 250
                logo_y = 280

            ratio = min(max_width / sponsor_logo.width, max_height / sponsor_logo.height)
            new_width = int(sponsor_logo.width * ratio)
            new_height = int(sponsor_logo.height * ratio)
            sponsor_logo = sponsor_logo.resize((new_width, new_height), Image.Resampling.LANCZOS)

            logo_x = (size[0] - new_width) // 2

            # White background for logo
            logo_bg = Image.new('RGBA', (new_width + 40, new_height + 40), (255, 255, 255, 255))
            img.paste(logo_bg, (logo_x - 20, logo_y - 20))
            img.paste(sponsor_logo, (logo_x, logo_y), sponsor_logo)

            name_y = logo_y + new_height + 40
        else:
            name_y = badge_y + 200

        draw = ImageDraw.Draw(img)

        # Sponsor name
        font_name = get_font(int(32 * font_scale), bold=True)
        bbox = draw.textbbox((0, 0), name, font=font_name)
        name_width = bbox[2] - bbox[0]
        draw.text(((size[0] - name_width) // 2, name_y), name, fill=DARK_GRAY, font=font_name)

        # Event info
        font_info = get_font(int(24 * font_scale))
        info_y = name_y + 50

        info_text = f"{BRAND_NAME} 2026"
        bbox = draw.textbbox((0, 0), info_text, font=font_info)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, info_y), info_text, fill=DARK_TEAL, font=font_info)

        date_text = f"{EVENT_DATE} • {EVENT_LOCATION}"
        bbox = draw.textbbox((0, 0), date_text, font=font_info)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, info_y + 32), date_text, fill=DARK_GRAY, font=font_info)

        # HRDevFest logo at bottom
        hrdevfest_logo = ASSETS_DIR / "logo.png"
        if hrdevfest_logo.exists():
            logo = Image.open(hrdevfest_logo).convert("RGBA")
            logo_scale = 0.15 if is_landscape else 0.18
            logo_width = int(size[0] * logo_scale)
            ratio = logo_width / logo.width
            logo_height = int(logo.height * ratio)
            logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
            logo_x = (size[0] - logo_width) // 2
            logo_y = size[1] - logo_height - 30
            img.paste(logo, (logo_x, logo_y), logo)

        # Save
        output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
        img.convert('RGB').save(output_path, quality=95)
        output_files.append(output_path)
        print(f"  Created: {output_path.name}")

    return output_files


def create_custom_image(prompt: str, output_name: str, formats: list = None) -> list:
    """
    Create a custom image using Gemini AI.

    Sends base.png as reference along with the user's prompt.
    Requires GEMINI_API_KEY environment variable.
    """
    if formats is None:
        formats = ["square", "landscape"]

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("  [ERROR] GEMINI_API_KEY environment variable not set")
        print("  Set it with: export GEMINI_API_KEY='your-key-here'")
        return []

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        print("  [ERROR] google-genai package not installed")
        print("  Install with: pip install google-genai")
        return []

    output_files = []
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Initialize client
    client = genai.Client(api_key=api_key)

    # Brand style guidance
    brand_style = """
    Style: Hampton Roads DevFest 2026 promotional image.
    Colors: Teal/cyan accent (#00B4D8), dark gray text, white/light backgrounds.
    Vibe: Professional yet approachable, community-focused, developer culture.
    Location: Virginia Beach, Hampton Roads area, Virginia.
    Event: Hampton Roads DevFest 2026, February 27, 2026.
    Include event branding elements matching the reference image style.
    """

    full_prompt = f"{brand_style}\n\nUser request: {prompt}"

    for fmt in formats:
        if fmt == "square":
            aspect = "1:1"
            suffix = "-square"
        else:
            aspect = "16:9"
            suffix = "-landscape"

        try:
            print(f"  Generating {fmt} image with Gemini...")
            response = client.models.generate_images(
                model="imagen-4.0-generate-001",
                prompt=full_prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio=aspect,
                    safety_filter_level="BLOCK_LOW_AND_ABOVE",
                )
            )

            if response.generated_images:
                image = response.generated_images[0]
                output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
                with open(output_path, "wb") as f:
                    f.write(image.image.image_bytes)
                output_files.append(output_path)
                print(f"  Created: {output_path.name}")
            else:
                print(f"  [WARN] No image generated for {fmt}")

        except Exception as e:
            print(f"  [ERROR] Failed to generate {fmt}: {e}")

    return output_files


def process_batch(file_path: Path, item_type: str, formats: list = None) -> list:
    """Process multiple items from a JSON file."""
    if not file_path.exists():
        print(f"[ERROR] Batch file not found: {file_path}")
        return []

    with open(file_path, 'r') as f:
        data = json.load(f)

    # Support both direct list and wrapped format
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict) and "items" in data:
        items = data["items"]
        if "type" in data and not item_type:
            item_type = data["type"]
    else:
        print("[ERROR] Invalid JSON format. Expected list or {items: [...], type: '...'}")
        return []

    output_files = []
    total = len(items)

    print(f"\nProcessing {total} {item_type} items...")

    for i, item in enumerate(items, 1):
        print(f"\n[{i}/{total}] {item.get('name', item.get('output', 'unknown'))}")

        if item_type == "speaker":
            name = item.get("name", "Speaker Name")
            title = item.get("title", "Title")
            photo = item.get("photo", "")
            output = item.get("output", name.lower().replace(" ", "-"))

            photo_path = BASE_DIR / photo if photo else Path("")
            files = create_speaker_image(name, title, photo_path, output, formats)
            output_files.extend(files)

        elif item_type == "sponsor":
            name = item.get("name", "Sponsor Name")
            logo = item.get("logo", "")
            tier = item.get("tier", "Gold")
            output = item.get("output", f"sponsor-{name.lower().replace(' ', '-')}")

            logo_path = SPONSORS_DIR / logo if logo else Path("")
            files = create_sponsor_image(name, logo_path, tier, output, formats)
            output_files.extend(files)

        elif item_type == "custom":
            prompt = item.get("prompt", "")
            output = item.get("output", f"custom-{i}")

            if prompt:
                files = create_custom_image(prompt, output, formats)
                output_files.extend(files)

    return output_files


def main():
    parser = argparse.ArgumentParser(
        description="HRDevFest 2026 Social Media Image Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_social.py speaker --name "Lionel Sapp" --title "Founder, Digital Builders" --photo LionelSapp.jpeg
  python generate_social.py sponsor --name "City of Virginia Beach" --logo cvb.png --tier Platinum
  python generate_social.py custom --prompt "Create a TICKETS ON SALE announcement" --output tickets-sale
  python generate_social.py batch --file speakers.json --type speaker
        """
    )

    subparsers = parser.add_subparsers(dest="mode", help="Generation mode")

    # Speaker subcommand
    speaker_parser = subparsers.add_parser("speaker", help="Generate speaker announcement image")
    speaker_parser.add_argument("--name", required=True, help="Speaker name")
    speaker_parser.add_argument("--title", required=True, help="Speaker title/role")
    speaker_parser.add_argument("--photo", required=True, help="Photo filename (in speaker-social/2026/)")
    speaker_parser.add_argument("--output", help="Output filename (without extension)")
    speaker_parser.add_argument("--format", choices=["square", "landscape", "both"], default="both",
                                help="Output format (default: both)")

    # Sponsor subcommand
    sponsor_parser = subparsers.add_parser("sponsor", help="Generate sponsor appreciation image")
    sponsor_parser.add_argument("--name", required=True, help="Sponsor name")
    sponsor_parser.add_argument("--logo", required=True, help="Logo filename (in src/assets/sponsors/)")
    sponsor_parser.add_argument("--tier", default="Gold", help="Sponsor tier (Platinum, Gold, Silver)")
    sponsor_parser.add_argument("--output", help="Output filename (without extension)")
    sponsor_parser.add_argument("--format", choices=["square", "landscape", "both"], default="both",
                                help="Output format (default: both)")

    # Custom subcommand
    custom_parser = subparsers.add_parser("custom", help="Generate AI-powered custom image (requires GEMINI_API_KEY)")
    custom_parser.add_argument("--prompt", required=True, help="Image generation prompt")
    custom_parser.add_argument("--output", required=True, help="Output filename (without extension)")
    custom_parser.add_argument("--format", choices=["square", "landscape", "both"], default="both",
                               help="Output format (default: both)")

    # Batch subcommand
    batch_parser = subparsers.add_parser("batch", help="Process multiple items from JSON file")
    batch_parser.add_argument("--file", required=True, help="JSON file with items to process")
    batch_parser.add_argument("--type", choices=["speaker", "sponsor", "custom"], required=True,
                              help="Type of items in the batch")
    batch_parser.add_argument("--format", choices=["square", "landscape", "both"], default="both",
                              help="Output format (default: both)")

    args = parser.parse_args()

    if not args.mode:
        parser.print_help()
        sys.exit(1)

    # Parse format option
    if args.format == "both":
        formats = ["square", "landscape"]
    else:
        formats = [args.format]

    print("=" * 60)
    print("HRDevFest 2026 Social Media Image Generator")
    print(f"Mode: {args.mode}")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)

    if args.mode == "speaker":
        output_name = args.output or args.name.lower().replace(" ", "-")
        photo_path = BASE_DIR / args.photo
        create_speaker_image(args.name, args.title, photo_path, output_name, formats)

    elif args.mode == "sponsor":
        output_name = args.output or f"sponsor-{args.name.lower().replace(' ', '-')}"
        logo_path = SPONSORS_DIR / args.logo
        create_sponsor_image(args.name, logo_path, args.tier, output_name, formats)

    elif args.mode == "custom":
        create_custom_image(args.prompt, args.output, formats)

    elif args.mode == "batch":
        file_path = Path(args.file)
        if not file_path.is_absolute():
            file_path = BASE_DIR / file_path
        process_batch(file_path, args.type, formats)

    print("\n" + "=" * 60)
    print("Generation complete!")
    print(f"Output directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
