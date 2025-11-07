# How to Add Partner Logos

Follow these simple steps to add or update partner company logos on your PixelsGames website:

## Step 1: Prepare Your Logo

1. Create or obtain your partner's logo in SVG, PNG, or JPG format
2. Recommended size: 200x200 pixels (square format works best)
3. Use transparent backgrounds for PNG files
4. Name your file descriptively (e.g., `company-name.svg`)

## Step 2: Add Logo to Project

1. Place your logo file in the `public/partners/` folder
2. Example: `public/partners/newcompany.svg`

## Step 3: Update Configuration

1. Open `lib/partners-config.ts`
2. Add a new entry to the `partners` array:

\`\`\`typescript
{ name: "NewCompany", image: "/partners/newcompany.svg" }
\`\`\`

## Complete Example

\`\`\`typescript
export const partners = [
  { name: "TechCorp", image: "/partners/techcorp.svg" },
  { name: "GameStudio", image: "/partners/gamestudio.svg" },
  // Add your new partner here:
  { name: "NewCompany", image: "/partners/newcompany.svg" },
]
\`\`\`

## That's It!

The carousel will automatically display your new partner logo with smooth scrolling animation. No need to restart the server - just refresh the page!

## Tips

- Keep logo files under 100KB for fast loading
- Use consistent styling across all logos
- Test on both light and dark backgrounds
- SVG format is recommended for crisp scaling
