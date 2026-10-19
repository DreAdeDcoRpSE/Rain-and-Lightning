# Rain & Lightning Effect

A lightweight JavaScript weather effect for websites that adds animated rain, realistic lightning flashes, and water droplets that randomly appear on the screen.

Everything runs using HTML5 Canvas, with no external libraries, images, or dependencies required.

The effect sits over your website without interfering with links, buttons, scrolling, or other page functionality.

## Features

- **Animated Rain** – Rain falls continuously across the screen, with adjustable speed, length, opacity, and wind direction.
- **Realistic Lightning** – Random lightning flashes with different brightness levels, durations, and patterns.
- **Multiple Lightning Flashes** – Lightning can produce single, double, triple, or occasional quadruple flashes.
- **Water Droplets** – Small water droplets randomly appear on the screen, simulating rain hitting glass.
- **Droplet Movement** – Some droplets slowly slide downward before fading away.
- **Fully Customizable** – Adjust the rain, lightning, and water droplets through a simple configuration section.
- **Lightweight** – Uses HTML5 Canvas and JavaScript without external dependencies.
- **Automatic Pausing** – Animations pause when the browser tab is hidden.
- **Reduced Motion Support** – Respects the visitor's reduced-motion preference.
- **Non-Interactive Overlay** – Does not interfere with normal website navigation.

## Requirements

- A modern web browser supporting HTML5 Canvas.
- JavaScript enabled.

No additional software, plugins, or libraries are needed.

## Installation

**Step 1:** Download the `rain.js` file.

**Step 2:** Upload it to your website. For example:

```text
your-website/
    js/
        rain.js
```

**Step 3:** Add the following code to your website, preferably near the bottom of the page before the closing `</body>` tag.

```html
<script src="js/rain.js" defer></script>
```

That's it! The rain effect should now appear on your website.

The script automatically creates the Canvas overlay, so there is no need to add any additional HTML elements.

## Configuration

All the settings can be found near the top of `rain.js`.

The following are the default settings used in the current version:

```javascript
const config = {
    rainDrops: 140,
    rainSpeed: 12,
    rainLength: 18,
    rainOpacity: 0.60,
    wind: 2,
    lightningEnabled: true,
    lightningMinDelay: 8000,
    lightningMaxDelay: 18000,
    lightningOpacity: 0.50,
    glassDropletsEnabled: true,
    glassDropletsMax: 25,
    glassDropletMinDelay: 200,
    glassDropletMaxDelay: 1200,
    glassDropletLife: 5500
};
```

### Rain Settings

| Setting | Description |
|---|---|
| `rainDrops` | Number of falling raindrops displayed on the screen. |
| `rainSpeed` | Controls how quickly the rain falls. |
| `rainLength` | Controls the length of each rain streak. |
| `rainOpacity` | Controls the visibility of the rain. Values range from 0.0 to 1.0. |
| `wind` | Controls the horizontal movement of the rain. |

Increasing `rainDrops` will make the rain heavier, while increasing `rainOpacity` will make individual streaks more visible.

### Lightning Settings

| Setting | Description |
|---|---|
| `lightningEnabled` | Enables or disables lightning effects (`true` or `false`). |
| `lightningMinDelay` | Minimum delay between lightning events, in milliseconds. |
| `lightningMaxDelay` | Maximum delay between lightning events, in milliseconds. |
| `lightningOpacity` | Maximum brightness of lightning flashes. |

Unlike a basic lightning effect, this script does not use the same flash every time.

Each lightning event randomly determines how many flashes occur, how bright they are, and how quickly they fade.

Lightning can produce:

- Single flashes.
- Double flashes.
- Triple flashes.
- Occasional quadruple flashes.
- Different brightness levels within the same lightning event.

The delays between individual flashes are also randomized, helping to create a more natural thunderstorm effect.

For example:

```javascript
lightningMinDelay: 8000,
lightningMaxDelay: 18000,
lightningOpacity: 0.50,
```

This allows lightning events to occur approximately every 8–18 seconds, with different flash patterns and brightness levels.

**Note:** The lightning effect simulates flashes illuminating the screen. It does not draw visible lightning bolts or include thunder sounds.

### Water Droplet Settings

| Setting | Description |
|---|---|
| `glassDropletsEnabled` | Enables or disables water droplets (`true` or `false`). |
| `glassDropletsMax` | Maximum number of droplets allowed on the screen at once. |
| `glassDropletMinDelay` | Minimum delay before another droplet appears, in milliseconds. |
| `glassDropletMaxDelay` | Maximum delay before another droplet appears, in milliseconds. |
| `glassDropletLife` | Approximate lifespan of each droplet, in milliseconds. |

Water droplets appear individually at random locations on the screen.

Each droplet has a slightly different size and lifespan. Some remain in place, while others slowly slide downward before disappearing.

For example:

```javascript
glassDropletsMax: 25,
glassDropletMinDelay: 200,
glassDropletMaxDelay: 1200,
glassDropletLife: 5500
```

These settings allow up to 25 droplets on the screen, with new droplets appearing at randomized intervals between 0.2 and 1.2 seconds.

The actual number visible depends on how frequently droplets appear and how long they remain visible.

**Important:** Increasing `glassDropletsMax` does not automatically create more droplets. To increase the number visible at once, reduce the arrival delays or increase their lifespan.

## Performance

The script is designed to remain lightweight, even when running continuously.

It uses a single HTML5 Canvas for all three effects rather than creating hundreds of individual HTML elements.

A few additional performance features include:

- Uses `requestAnimationFrame()` for animation.
- Automatically pauses when the browser tab is hidden.
- Adjusts to browser window resizing.
- Limits the number of water droplets.
- Uses no external animation libraries.
- Does not require images, sprites, or additional downloads.

Performance will vary depending on the device, browser, screen resolution, and configuration.

If you experience performance issues, try lowering the `rainDrops` value or reducing the number of water droplets.

## Compatibility

The effect should work in modern versions of:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Brave
- Safari

It can be used on most websites, including PHP-based content management systems, static HTML websites, and custom-built websites.

## Additional Information

The rain and water droplets are drawn over the website using a transparent Canvas.

The Canvas uses `pointer-events: none`, meaning visitors can still click links, use menus, scroll, and interact with the website normally.

The script does not collect visitor information, use cookies, or make external network requests.

## License

Add your preferred license here before publishing.

## Credits

**Created by coRpSE**  
[HeadShot Domain](https://www.headshotdomain.net)

Developed for adding a lightweight, customizable rain and thunderstorm atmosphere to websites.
