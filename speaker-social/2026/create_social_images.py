#!/usr/bin/env python3
"""
HRDevFest 2026 Social Media Image Creator
Creates social images by compositing actual logos and photos using PIL.
Generates both square (1080x1080) and landscape (1200x630) versions.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
PROJECT_ROOT = BASE_DIR.parent.parent
ASSETS_DIR = PROJECT_ROOT / "src" / "assets"
SPONSORS_DIR = ASSETS_DIR / "sponsors"
PHOTOS_2024_DIR = ASSETS_DIR / "2024-photos"
TEMPLATE_PATH = BASE_DIR / "templates" / "base.png"
BACKGROUNDS_DIR = BASE_DIR / "backgrounds"
OUTPUT_DIR = BASE_DIR / "generated"

# Brand colors (from HRDevFest branding)
TEAL = (0, 180, 216)  # #00B4D8
DARK_TEAL = (72, 111, 122)  # #486F7A
DARK_GRAY = (51, 51, 51)  # #333333
WHITE = (255, 255, 255)
LIGHT_GRAY = (245, 245, 245)

# Image dimensions
SIZE_SQUARE = (1080, 1080)  # Universal square
SIZE_LANDSCAPE = (1200, 630)  # X, LinkedIn, Bluesky

# Consistent branding
BRAND_NAME = "Hampton Roads DevFest"
EVENT_DATE = "February 27, 2026"
EVENT_LOCATION = "Virginia Beach, VA"
WEBSITE = "hrdevfest.org"


def get_font(size: int, bold: bool = False):
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


def create_gradient_background(size: tuple, color1: tuple, color2: tuple) -> Image.Image:
    """Create a vertical gradient background."""
    img = Image.new('RGB', size, color1)
    draw = ImageDraw.Draw(img)

    for y in range(size[1]):
        ratio = y / size[1]
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))

    return img


def load_template_background(size: tuple) -> Image.Image:
    """Load the base.png template and resize/crop to target size."""
    if not TEMPLATE_PATH.exists():
        # Fallback to gradient if template not found
        return create_gradient_background(size, LIGHT_GRAY, WHITE)

    template = Image.open(TEMPLATE_PATH).convert("RGB")

    # Crop/resize to target aspect ratio
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


def load_ai_background(bg_name: str, size: tuple) -> Image.Image:
    """Load an AI-generated background and resize to target size."""
    suffix = "landscape" if size == SIZE_LANDSCAPE else "square"
    bg_path = BACKGROUNDS_DIR / f"{bg_name}-{suffix}.png"

    if not bg_path.exists():
        print(f"    [WARN] Background not found: {bg_path.name}, using fallback")
        return create_gradient_background(size, LIGHT_GRAY, WHITE)

    bg = Image.open(bg_path).convert("RGB")

    # Resize if needed
    if bg.size != size:
        bg = bg.resize(size, Image.Resampling.LANCZOS)

    return bg


def add_logo_watermark(img: Image.Image, logo_path: Path, position: str = "bottom-center", scale: float = 0.15) -> Image.Image:
    """Add HRDevFest logo watermark to image."""
    if not logo_path.exists():
        return img

    logo = Image.open(logo_path).convert("RGBA")

    # Scale logo
    logo_width = int(img.width * scale)
    ratio = logo_width / logo.width
    logo_height = int(logo.height * ratio)
    logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # Position
    margin = 30
    if position == "bottom-center":
        x = (img.width - logo_width) // 2
        y = img.height - logo_height - margin
    elif position == "bottom-right":
        x = img.width - logo_width - margin
        y = img.height - logo_height - margin
    elif position == "top-center":
        x = (img.width - logo_width) // 2
        y = margin
    else:
        x, y = margin, margin

    # Composite
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    img.paste(logo, (x, y), logo)

    return img


def create_sponsor_image(sponsor_logo_path: Path, sponsor_name: str, tier: str, output_name: str, bg_name: str = "sponsor-gold"):
    """Create a sponsor appreciation image with actual sponsor logo."""

    for size, suffix in [(SIZE_SQUARE, "-square"), (SIZE_LANDSCAPE, "-landscape")]:
        is_landscape = size == SIZE_LANDSCAPE

        # Use AI-generated background
        img = load_ai_background(bg_name, size)

        # Add semi-transparent white overlay for text readability
        overlay = Image.new('RGBA', size, (255, 255, 255, 180))
        img = img.convert('RGBA')
        img = Image.alpha_composite(img, overlay)
        draw = ImageDraw.Draw(img)

        # Add decorative top bar
        draw.rectangle([(0, 0), (size[0], 6)], fill=TEAL)

        # Scale factors for landscape
        y_offset = 0 if is_landscape else 0
        font_scale = 0.85 if is_landscape else 1.0

        # "THANK YOU" header
        font_header = get_font(int(48 * font_scale), bold=True)
        header_text = "THANK YOU"
        bbox = draw.textbbox((0, 0), header_text, font=font_header)
        header_width = bbox[2] - bbox[0]
        header_y = 40 if is_landscape else 80
        draw.text(((size[0] - header_width) // 2, header_y), header_text, fill=TEAL, font=font_header)

        # Tier badge
        font_tier = get_font(int(28 * font_scale))
        tier_text = f"{tier} Sponsor"
        bbox = draw.textbbox((0, 0), tier_text, font=font_tier)
        tier_width = bbox[2] - bbox[0]

        badge_padding = 16
        badge_x = (size[0] - tier_width) // 2 - badge_padding
        badge_y = header_y + 60
        draw.rounded_rectangle(
            [(badge_x, badge_y), (badge_x + tier_width + badge_padding * 2, badge_y + 40)],
            radius=20,
            fill=TEAL
        )
        draw.text(((size[0] - tier_width) // 2, badge_y + 6), tier_text, fill=WHITE, font=font_tier)

        # Add sponsor logo
        if sponsor_logo_path.exists():
            sponsor_logo = Image.open(sponsor_logo_path).convert("RGBA")

            # Scale to fit
            if is_landscape:
                max_width, max_height = 400, 150
                logo_y = badge_y + 70
            else:
                max_width, max_height = 500, 250
                logo_y = 260

            ratio = min(max_width / sponsor_logo.width, max_height / sponsor_logo.height)
            new_width = int(sponsor_logo.width * ratio)
            new_height = int(sponsor_logo.height * ratio)
            sponsor_logo = sponsor_logo.resize((new_width, new_height), Image.Resampling.LANCZOS)

            logo_x = (size[0] - new_width) // 2

            # White background for logo
            logo_bg = Image.new('RGBA', (new_width + 40, new_height + 40), (255, 255, 255, 255))
            img = img.convert('RGBA')
            img.paste(logo_bg, (logo_x - 20, logo_y - 20))
            img.paste(sponsor_logo, (logo_x, logo_y), sponsor_logo)

        draw = ImageDraw.Draw(img)

        # Sponsor name
        font_name = get_font(int(32 * font_scale), bold=True)
        bbox = draw.textbbox((0, 0), sponsor_name, font=font_name)
        name_width = bbox[2] - bbox[0]
        name_y = (logo_y + max_height + 40) if sponsor_logo_path.exists() else badge_y + 200
        draw.text(((size[0] - name_width) // 2, name_y), sponsor_name, fill=DARK_GRAY, font=font_name)

        # Event info
        font_info = get_font(int(24 * font_scale))
        info_y = name_y + 50

        info_text = f"{BRAND_NAME} 2026"
        bbox = draw.textbbox((0, 0), info_text, font=font_info)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, info_y), info_text, fill=DARK_TEAL, font=font_info)

        date_text = f"{EVENT_DATE} • {EVENT_LOCATION}"
        bbox = draw.textbbox((0, 0), date_text, font=font_info)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, info_y + 30), date_text, fill=DARK_GRAY, font=font_info)

        # Add HRDevFest logo
        hrdevfest_logo = ASSETS_DIR / "logo.png"
        logo_scale = 0.15 if is_landscape else 0.18
        img = add_logo_watermark(img, hrdevfest_logo, "bottom-center", logo_scale)

        # Save
        output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
        img.convert('RGB').save(output_path, quality=95)
        print(f"  Created: {output_path.name}")


def create_multi_sponsor_image(sponsor_logos: list, sponsor_names: list, tier: str, output_name: str, bg_name: str = "sponsor-silver"):
    """Create a sponsor appreciation image with multiple sponsor logos."""

    for size, suffix in [(SIZE_SQUARE, "-square"), (SIZE_LANDSCAPE, "-landscape")]:
        is_landscape = size == SIZE_LANDSCAPE
        font_scale = 0.85 if is_landscape else 1.0

        # Use AI-generated background
        img = load_ai_background(bg_name, size)

        # Add semi-transparent white overlay for text readability
        overlay = Image.new('RGBA', size, (255, 255, 255, 180))
        img = img.convert('RGBA')
        img = Image.alpha_composite(img, overlay)
        draw = ImageDraw.Draw(img)
        draw.rectangle([(0, 0), (size[0], 6)], fill=TEAL)

        # Header
        font_header = get_font(int(44 * font_scale), bold=True)
        header_text = "THANK YOU"
        bbox = draw.textbbox((0, 0), header_text, font=font_header)
        header_y = 30 if is_landscape else 50
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, header_y), header_text, fill=TEAL, font=font_header)

        # Tier badge
        font_tier = get_font(int(24 * font_scale))
        tier_text = f"{tier} Sponsors"
        bbox = draw.textbbox((0, 0), tier_text, font=font_tier)
        tier_width = bbox[2] - bbox[0]
        badge_y = header_y + 50
        badge_x = (size[0] - tier_width) // 2 - 14
        draw.rounded_rectangle(
            [(badge_x, badge_y), (badge_x + tier_width + 28, badge_y + 36)],
            radius=18, fill=TEAL
        )
        draw.text(((size[0] - tier_width) // 2, badge_y + 5), tier_text, fill=WHITE, font=font_tier)

        img = img.convert('RGBA')

        # Logo layout
        num_sponsors = len(sponsor_logos)
        logo_y = badge_y + 55

        if is_landscape:
            max_w, max_h = 280, 100
            if num_sponsors == 2:
                positions = [(size[0]//4 - max_w//2, logo_y), (3*size[0]//4 - max_w//2, logo_y)]
            else:
                positions = [(size[0]//6 - max_w//2, logo_y), (size[0]//2 - max_w//2, logo_y), (5*size[0]//6 - max_w//2, logo_y)]
        else:
            max_w, max_h = 350, 150
            if num_sponsors == 2:
                positions = [(100, logo_y), (size[0] - 100 - max_w, logo_y)]
            else:
                positions = [(50, logo_y), (size[0]//2 - max_w//2, logo_y), (size[0] - 50 - max_w, logo_y)]

        for i, (logo_path, name) in enumerate(zip(sponsor_logos, sponsor_names)):
            if i >= len(positions) or not logo_path.exists():
                continue

            logo = Image.open(logo_path).convert("RGBA")
            ratio = min(max_w / logo.width, max_h / logo.height)
            new_w, new_h = int(logo.width * ratio), int(logo.height * ratio)
            logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

            pos_x, pos_y = positions[i]
            # Center in allocated space
            pos_x += (max_w - new_w) // 2
            pos_y += (max_h - new_h) // 2

            logo_bg = Image.new('RGBA', (new_w + 20, new_h + 20), (255, 255, 255, 255))
            img.paste(logo_bg, (pos_x - 10, pos_y - 10))
            img.paste(logo, (pos_x, pos_y), logo)

        draw = ImageDraw.Draw(img)

        # Sponsor names
        names_y = logo_y + max_h + 30
        font_names = get_font(int(22 * font_scale), bold=True)
        names_text = " • ".join(sponsor_names)
        bbox = draw.textbbox((0, 0), names_text, font=font_names)
        if bbox[2] - bbox[0] > size[0] - 60:
            font_names = get_font(int(18 * font_scale), bold=True)
            bbox = draw.textbbox((0, 0), names_text, font=font_names)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, names_y), names_text, fill=DARK_GRAY, font=font_names)

        # Event info
        font_info = get_font(int(22 * font_scale))
        info_y = names_y + 40
        info_text = f"{BRAND_NAME} 2026 • {EVENT_DATE}"
        bbox = draw.textbbox((0, 0), info_text, font=font_info)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, info_y), info_text, fill=DARK_TEAL, font=font_info)

        # Logo
        hrdevfest_logo = ASSETS_DIR / "logo.png"
        img = add_logo_watermark(img, hrdevfest_logo, "bottom-center", 0.14 if is_landscape else 0.16)

        output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
        img.convert('RGB').save(output_path, quality=95)
        print(f"  Created: {output_path.name}")


def create_throwback_image(photo_path: Path, session_title: str, speaker_name: str, output_name: str):
    """Create a throwback post using actual 2024 photo."""
    if not photo_path.exists():
        print(f"  Photo not found: {photo_path}")
        return

    for size, suffix in [(SIZE_SQUARE, "-square"), (SIZE_LANDSCAPE, "-landscape")]:
        is_landscape = size == SIZE_LANDSCAPE
        font_scale = 0.9 if is_landscape else 1.0

        # Load and crop photo
        photo = Image.open(photo_path).convert("RGB")

        # Auto-rotate if needed (EXIF)
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

        # Crop to target aspect ratio
        target_ratio = size[0] / size[1]
        photo_ratio = photo.width / photo.height

        if photo_ratio > target_ratio:
            new_width = int(photo.height * target_ratio)
            left = (photo.width - new_width) // 2
            photo = photo.crop((left, 0, left + new_width, photo.height))
        else:
            new_height = int(photo.width / target_ratio)
            top = (photo.height - new_height) // 2
            photo = photo.crop((0, top, photo.width, top + new_height))

        photo = photo.resize(size, Image.Resampling.LANCZOS)

        # Overlay
        overlay = Image.new('RGBA', size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        top_bar_h = 120 if is_landscape else 160
        bottom_bar_h = 140 if is_landscape else 180
        draw.rectangle([(0, 0), (size[0], top_bar_h)], fill=(0, 0, 0, 180))
        draw.rectangle([(0, size[1] - bottom_bar_h), (size[0], size[1])], fill=(0, 0, 0, 180))

        photo = photo.convert('RGBA')
        photo = Image.alpha_composite(photo, overlay)
        draw = ImageDraw.Draw(photo)

        # Top text
        margin = 30
        font_badge = get_font(int(32 * font_scale), bold=True)
        draw.text((margin, 25 if is_landscape else 35), "#THROWBACK 2024", fill=TEAL, font=font_badge)

        font_event = get_font(int(26 * font_scale))
        draw.text((margin, 65 if is_landscape else 85), BRAND_NAME, fill=WHITE, font=font_event)

        # Bottom text
        font_title = get_font(int(28 * font_scale), bold=True)
        title_y = size[1] - bottom_bar_h + 20
        draw.text((margin, title_y), session_title, fill=WHITE, font=font_title)

        font_speaker = get_font(int(24 * font_scale))
        draw.text((margin, title_y + 40), f"— {speaker_name}", fill=TEAL, font=font_speaker)

        font_cta = get_font(int(20 * font_scale))
        cta_text = f"More great sessions coming {EVENT_DATE}!"
        draw.text((margin, title_y + 75 if is_landscape else title_y + 85), cta_text, fill=LIGHT_GRAY, font=font_cta)

        output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
        photo.convert('RGB').save(output_path, quality=95)
        print(f"  Created: {output_path.name}")


def create_countdown_image(days_text: str, subtext: str, output_name: str, bg_name: str = "countdown-1month"):
    """Create a countdown image with proper branding."""

    for size, suffix in [(SIZE_SQUARE, "-square"), (SIZE_LANDSCAPE, "-landscape")]:
        is_landscape = size == SIZE_LANDSCAPE
        font_scale = 0.9 if is_landscape else 1.0

        # Use AI-generated background
        img = load_ai_background(bg_name, size)

        # Add semi-transparent teal overlay for text readability
        overlay = Image.new('RGBA', size, (0, 100, 140, 160))
        img = img.convert('RGBA')
        img = Image.alpha_composite(img, overlay)
        draw = ImageDraw.Draw(img)

        # Countdown text
        font_big = get_font(int(100 * font_scale), bold=True)
        bbox = draw.textbbox((0, 0), days_text, font=font_big)
        text_w = bbox[2] - bbox[0]
        text_y = 150 if is_landscape else 260
        draw.text(((size[0] - text_w) // 2, text_y), days_text, fill=WHITE, font=font_big)

        # "until Hampton Roads DevFest 2026"
        font_sub = get_font(int(32 * font_scale))
        sub_text = f"until {BRAND_NAME} 2026"
        bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
        sub_y = text_y + 110 if is_landscape else text_y + 130
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, sub_y), sub_text, fill=WHITE, font=font_sub)

        # Date and location
        font_info = get_font(int(28 * font_scale), bold=True)
        info_y = sub_y + 50
        bbox = draw.textbbox((0, 0), EVENT_DATE, font=font_info)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, info_y), EVENT_DATE, fill=WHITE, font=font_info)

        bbox = draw.textbbox((0, 0), EVENT_LOCATION, font=font_info)
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, info_y + 35), EVENT_LOCATION, fill=(200, 230, 240), font=font_info)

        # CTA
        font_cta = get_font(int(24 * font_scale))
        bbox = draw.textbbox((0, 0), subtext, font=font_cta)
        cta_y = info_y + 90 if is_landscape else info_y + 100
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, cta_y), subtext, fill=(200, 230, 240), font=font_cta)

        # Website
        font_url = get_font(int(28 * font_scale), bold=True)
        bbox = draw.textbbox((0, 0), WEBSITE, font=font_url)
        url_y = cta_y + 45
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, url_y), WEBSITE, fill=WHITE, font=font_url)

        # Logo
        hrdevfest_logo = ASSETS_DIR / "logo-white.png"
        if hrdevfest_logo.exists():
            img = add_logo_watermark(img.convert('RGBA'), hrdevfest_logo, "bottom-center", 0.18 if is_landscape else 0.22)

        output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
        img.convert('RGB').save(output_path, quality=95)
        print(f"  Created: {output_path.name}")


def create_swag_image(headline: str, subtext: str, output_name: str, bg_name: str = "swag-store"):
    """Create a swag/merch promotional image."""

    for size, suffix in [(SIZE_SQUARE, "-square"), (SIZE_LANDSCAPE, "-landscape")]:
        is_landscape = size == SIZE_LANDSCAPE
        font_scale = 0.85 if is_landscape else 1.0

        # Use AI-generated background
        img = load_ai_background(bg_name, size)

        # Add semi-transparent white overlay for text readability
        overlay = Image.new('RGBA', size, (255, 255, 255, 200))
        img = img.convert('RGBA')
        img = Image.alpha_composite(img, overlay)
        draw = ImageDraw.Draw(img)
        draw.rectangle([(0, 0), (size[0], 6)], fill=TEAL)
        draw.rectangle([(0, size[1] - 6), (size[0], size[1])], fill=TEAL)

        # Headline
        font_headline = get_font(int(56 * font_scale), bold=True)
        bbox = draw.textbbox((0, 0), headline, font=font_headline)
        headline_y = 60 if is_landscape else 100
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, headline_y), headline, fill=TEAL, font=font_headline)

        # Subtext
        font_sub = get_font(int(28 * font_scale))
        bbox = draw.textbbox((0, 0), subtext, font=font_sub)
        sub_y = headline_y + 65
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, sub_y), subtext, fill=DARK_GRAY, font=font_sub)

        # Product box
        margin = 60 if is_landscape else 80
        box_top = sub_y + 50
        box_height = 200 if is_landscape else 280
        draw.rounded_rectangle(
            [(margin, box_top), (size[0] - margin, box_top + box_height)],
            radius=15, fill=(250, 250, 250), outline=TEAL, width=2
        )

        # Products
        font_product = get_font(int(30 * font_scale))
        products = [
            ("Premium Unisex Tee", "$25"),
            ("Pullover Hoodie", "$35"),
            ("Crewneck Sweatshirt", "$35"),
        ]

        y_pos = box_top + (25 if is_landscape else 40)
        line_height = 55 if is_landscape else 70
        for product, price in products:
            draw.text((margin + 30, y_pos), product, fill=DARK_GRAY, font=font_product)
            bbox = draw.textbbox((0, 0), price, font=font_product)
            draw.text((size[0] - margin - 30 - (bbox[2] - bbox[0]), y_pos), price, fill=TEAL, font=font_product)
            y_pos += line_height

        # Nonprofit note
        font_note = get_font(int(20 * font_scale))
        note_text = "All proceeds support RevolutionVA 501(c)(3)"
        bbox = draw.textbbox((0, 0), note_text, font=font_note)
        note_y = box_top + box_height + 20
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, note_y), note_text, fill=DARK_GRAY, font=font_note)

        # Store URL
        font_url = get_font(int(24 * font_scale), bold=True)
        url_text = "bonfire.com/store/revolutionva"
        bbox = draw.textbbox((0, 0), url_text, font=font_url)
        url_y = note_y + 35
        draw.text(((size[0] - (bbox[2] - bbox[0])) // 2, url_y), url_text, fill=TEAL, font=font_url)

        # Logo
        hrdevfest_logo = ASSETS_DIR / "logo.png"
        img = img.convert('RGBA')
        img = add_logo_watermark(img, hrdevfest_logo, "bottom-center", 0.14 if is_landscape else 0.16)

        output_path = OUTPUT_DIR / f"{output_name}{suffix}.png"
        img.convert('RGB').save(output_path, quality=95)
        print(f"  Created: {output_path.name}")


def main():
    """Generate all social media images."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print(f"{BRAND_NAME} 2026 Social Media Image Creator")
    print("Generating square (1080x1080) and landscape (1200x630) versions")
    print("=" * 60)

    # === SPONSOR IMAGES ===
    print("\n--- Sponsor Images ---")

    create_sponsor_image(
        SPONSORS_DIR / "cvb.png",
        "City of Virginia Beach",
        "Platinum",
        "feb02-sponsor-platinum-vb",
        "sponsor-platinum"
    )

    create_sponsor_image(
        SPONSORS_DIR / "progress.png",
        "Progress Telerik",
        "Gold",
        "feb07-sponsor-gold-telerik",
        "sponsor-gold"
    )

    create_sponsor_image(
        SPONSORS_DIR / "stigian.png",
        "Stigian Consulting",
        "Gold",
        "feb09-sponsor-gold-stigian",
        "sponsor-gold"
    )

    create_multi_sponsor_image(
        [SPONSORS_DIR / "marathon.png", SPONSORS_DIR / "issuetrak.png"],
        ["Marathon Consulting", "Issuetrak"],
        "Silver",
        "feb15-sponsor-silver-duo",
        "sponsor-silver"
    )

    create_multi_sponsor_image(
        [SPONSORS_DIR / "noteable.png", SPONSORS_DIR / "opensearch.png", SPONSORS_DIR / "swiftkick.png"],
        ["Noteable", "OpenSearch", "Swift Kick"],
        "Silver",
        "feb22-sponsor-silver-trio",
        "sponsor-silver"
    )

    # === THROWBACK IMAGES ===
    print("\n--- Throwback Images ---")

    create_throwback_image(
        PHOTOS_2024_DIR / "2024-05-31 09.48.48.jpg",
        "Developer sessions at Zeiders Theater",
        f"{BRAND_NAME} 2024",
        "feb04-throwback-sessions"
    )

    create_throwback_image(
        PHOTOS_2024_DIR / "2024-05-31 12.04.00.jpg",
        "Networking and community",
        f"{BRAND_NAME} 2024",
        "feb08-throwback-networking"
    )

    create_throwback_image(
        PHOTOS_2024_DIR / "IMG_9620.jpeg",
        "Developer stickers and swag",
        f"{BRAND_NAME} 2024",
        "feb13-throwback-swag"
    )

    create_throwback_image(
        PHOTOS_2024_DIR / "2024-05-31 08.30.41.jpg",
        "Community connections",
        f"{BRAND_NAME} 2024",
        "feb17-throwback-community"
    )

    create_throwback_image(
        PHOTOS_2024_DIR / "2024-05-31 14.13.46.jpg",
        "Low-code solutions at Jefferson Lab",
        "Jenah Parman & Marla Schuchman",
        "feb20-throwback-lowcode"
    )

    create_throwback_image(
        PHOTOS_2024_DIR / "2024-05-31 12.11.53.jpg",
        "Lunch break on the terrace",
        f"{BRAND_NAME} 2024",
        "feb24-throwback-lunch"
    )

    # === COUNTDOWN IMAGES ===
    print("\n--- Countdown Images ---")

    create_countdown_image(
        "1 MONTH",
        "Tickets only $50 - includes lunch!",
        "feb01-countdown-1month",
        "countdown-1month"
    )

    create_countdown_image(
        "3 WEEKS",
        "Have you grabbed your ticket yet?",
        "feb11-countdown-3weeks",
        "countdown-3weeks"
    )

    create_countdown_image(
        "2 WEEKS",
        "Limited tickets remaining!",
        "feb16-countdown-2weeks",
        "countdown-2weeks"
    )

    create_countdown_image(
        "1 WEEK",
        "Final countdown - don't miss out!",
        "feb23-countdown-1week",
        "countdown-1week"
    )

    create_countdown_image(
        "TOMORROW!",
        "See you at Zeiders American Dream Theater!",
        "feb26-countdown-tomorrow",
        "countdown-tomorrow"
    )

    # === SWAG IMAGES ===
    print("\n--- Swag Images ---")

    create_swag_image(
        "SWAG STORE",
        "NOW OPEN!",
        "feb05-swag-launch",
        "swag-store"
    )

    create_swag_image(
        "HOODIE WEATHER",
        "Perfect for coding sessions",
        "feb12-swag-hoodie",
        "swag-hoodie"
    )

    create_swag_image(
        "PERFECT DEV GIFT",
        "Support our nonprofit mission",
        "feb19-swag-gift",
        "swag-gift"
    )

    create_swag_image(
        "LAST CHANCE!",
        "Order now for delivery before Feb 27",
        "feb25-swag-lastchance",
        "swag-lastchance"
    )

    print("\n" + "=" * 60)
    print("Image generation complete!")
    print(f"Output: {OUTPUT_DIR}")
    print("  -square.png = 1080x1080 (universal)")
    print("  -landscape.png = 1200x630 (X, LinkedIn, Bluesky)")


if __name__ == "__main__":
    main()
