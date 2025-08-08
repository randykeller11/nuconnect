# Visual Enhancement Instructions for Latest Landing Page

Drop this `instructions.md` into your workspace and feed it to your AI coding tool to refine icons and section headers.

---

## 1. Icon Improvements

1. **Curate a Single Icon Library**  
   - Pick one style (outline or solid) from a single icon set (e.g. Heroicons, Feather).  
   - Ensure **consistent stroke** (2 px) and **corner radius** across all icons.  

2. **Increase Visual Weight**  
   - Wrap each icon in a circular or rounded-rectangle `<div>`:  
     ```html
     <div class="w-12 h-12 flex items-center justify-center bg-brand-teal rounded-full shadow-md">
       <Icon name="chart-bar" class="w-6 h-6 text-white" />
     </div>
     ```  
   - Use the brand teal (`#00A99D`) for the background and white or charcoal for the icon itself.

3. **Add Subtle Hover States**  
   - On hover, scale up and soften shadow:  
     ```css
     .icon-wrapper:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
     ```

4. **Vary Fill & Outline**  
   - For “emphasis” sections (e.g. Hero, Features), use **filled** variants.  
   - For “informational” sections (e.g. Testimonials, What’s Inside), use **outline** variants.

5. **Maintain Spacing & Alignment**  
   - Always center icons above or beside text with a consistent gap (`mb-4` or `mr-4`).  
   - Don’t repeat the same icon in adjacent cards or list items—rotate through at least 8–10 icons.

---

## 2. Section Header Styling

1. **Gradient Text Accent**  
   - Apply a subtle two-tone gradient to H2 text via Tailwind:  
     ```html
     <h2 class="text-3xl font-bold bg-clip-text text-transparent 
                bg-gradient-to-r from-gold-light to-gold-dark">
       This Is Not Just About Money
     </h2>
     ```

2. **Decorative Underline / Separator**  
   - Add a custom SVG or CSS pseudo-element below each header:  
     ```css
     h2::after {
       content: "";
       display: block;
       width: 3rem; height: 3px;
       margin: 0.5rem auto;
       background: linear-gradient(to right, #E6B800, #CC9A00);
       border-radius: 2px;
     }
     ```

3. **Playful Typography**  
   - Use small-caps or spaced uppercase for subheads:  
     ```html
     <h3 class="text-xl uppercase tracking-widest text-charcoal">
       What We Stand For
     </h3>
     ```

4. **Entrance Animations**  
   - Wrap headers in Framer Motion’s `motion.h2` for a fade/slide-in on scroll:  
     ```jsx
     <motion.h2
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6 }}
       viewport={{ once: true }}
       className="..."
     >
       Who It Is For
     </motion.h2>
     ```

5. **Background Highlight**  
   - Optionally, place a semi-transparent color block behind the header text:  
     ```html
     <div class="inline-block px-4 py-1 bg-earth-gray/60 rounded-md">
       <h2 class="...">Try the Free Check-In</h2>
     </div>
     ```

---

## 3. Application

- **Locate** the landing page component (e.g. `pages/index.jsx` or `components/LandingSections.jsx`).  
- **Replace** existing icon wrappers and `<h2>` elements with the patterns above.  
- **Test** across mobile & desktop breakpoints, ensuring spacing and animations feel smooth.  
- **Review** to confirm icons no longer repeat and headers have a distinct, premium look.

> Once applied, rebuild and preview to ensure icons pop and section headers feel modern, dynamic, and on-brand.  
