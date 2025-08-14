# NuConnect Onboarding — Professional Focus & Profile Photo Improvements

## 1. Reduce Visual Clutter

- **Collapsible Panels:** Group *Industries*, *Skills*, *Interests*, and *Seniority* into collapsible or progressive panels (e.g., “Step 2A – Industries”, “Step 2B – Skills”, etc.) to keep the user focused on one decision at a time.
- **Visual Chips with Icons:** Represent each industry, skill, and interest as a compact pill/chip with an icon (e.g., 💻 for AI, 🎨 for Creative/Arts, 🌱 for Sustainability) to help users quickly scan and choose.

## 2. Improve Professional Focus Depth

- **Industries:** Expand the set with subcategories for precision (e.g., “Tech & Startups” → “SaaS,” “Cybersecurity,” “Biotech”). Add an “Other (type in)” option for unlisted sectors.
- **Skills:** Provide category filters at the top (Tech, Business, Creative, People Skills) so users can toggle instead of scrolling a long list. Allow bulk add from LinkedIn import to speed up selection.
- **Interests:** Add “Event Networking Goals” options (e.g., “Find a co-founder,” “Hire talent,” “Discover investment opportunities”).
- **Seniority:** Include “Student / Career Transition” to cover non-traditional paths.

## 3. Make Primary Skill Selection More Intuitive

- Replace “Double-click to set as Primary” with a clear **‘Set Primary’ button** or a **star icon toggle** that appears on hover.
- Show the chosen primary skill in a distinct highlight color above the list for clarity.

## 4. Enhance Guidance & Conversion

- Add a **progress bar subtext** with encouragement (“These details help us make smarter matches at your next event.”).
- Include small **tooltips or ‘Why This Matters’ pop-ups** for each section so users understand how their selections impact AI matching.

## 5. Profile Photo Storage Integration

- Store uploads in the **`avatars` bucket** with path convention: `avatars/{user_id}/{filename}`.
- On successful upload, save the **public or signed URL** to `profile_photo_url` in the `profiles` table.
- If replacing an image, delete the old file from the bucket to avoid orphaned storage.

