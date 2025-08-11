const fs = require('fs');
const path = require('path');

describe('Phase 1: Foundation Pruning Verification', () => {
  
  describe('Files that should be KEPT', () => {
    const requiredFiles = [
      'app/api/auth/login/route.ts',
      'app/api/auth/register/route.ts', 
      'app/api/auth/validate/route.ts',
      'components/ui/badge.tsx',
      'components/ui/button.tsx',
      'components/ui/card.tsx',
      'components/ui/input.tsx',
      'components/ui/tabs.tsx',
      'lib/query-provider.tsx',
      'server/storage.ts',
      'shared/schema.ts',
      'tailwind.config.js',
      'tsconfig.json',
      'next.config.js',
      'Procfile'
    ];

    requiredFiles.forEach(filePath => {
      test(`${filePath} should exist`, () => {
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });
  });

  describe('Matrimoney-specific files that should be REMOVED', () => {
    const removedFiles = [
      'components/landing/contact-form.tsx',
      'components/landing/hero-section.tsx',
      'components/landing/floating-menu.tsx',
      'components/demo-selection.tsx',
      'components/questionnaire.tsx'
    ];

    removedFiles.forEach(filePath => {
      test(`${filePath} should NOT exist`, () => {
        expect(fs.existsSync(filePath)).toBe(false);
      });
    });
  });

  describe('Schema should be updated for NuConnect', () => {
    test('shared/schema.ts should contain NuConnect tables', () => {
      if (fs.existsSync('shared/schema.ts')) {
        const schemaContent = fs.readFileSync('shared/schema.ts', 'utf8');
        
        // Check for NuConnect-specific tables
        expect(schemaContent).toContain('profiles');
        expect(schemaContent).toContain('events');
        expect(schemaContent).toContain('matchRooms');
        expect(schemaContent).toContain('matches');
        expect(schemaContent).toContain('contactShares');
        expect(schemaContent).toContain('connections');
        
        // Check for NuConnect-specific fields
        expect(schemaContent).toContain('interests');
        expect(schemaContent).toContain('careerGoals');
        expect(schemaContent).toContain('mentorshipPref');
        expect(schemaContent).toContain('matchScore');
        expect(schemaContent).toContain('sharedTopics');
        expect(schemaContent).toContain('aiExplanation');
      }
    });
  });

  describe('Tailwind config should have NuConnect colors', () => {
    test('tailwind.config.js should contain NuConnect color palette', () => {
      if (fs.existsSync('tailwind.config.js')) {
        const tailwindContent = fs.readFileSync('tailwind.config.js', 'utf8');
        
        // Check for NuConnect color palette
        expect(tailwindContent).toContain('inkwell');
        expect(tailwindContent).toContain('lunar');
        expect(tailwindContent).toContain('creme');
        expect(tailwindContent).toContain('aulait');
        
        // Check specific color values
        expect(tailwindContent).toContain('#2C3639'); // inkwell
        expect(tailwindContent).toContain('#3F4E4F'); // lunar
        expect(tailwindContent).toContain('#A27B5B'); // creme
        expect(tailwindContent).toContain('#DCD7C9'); // aulait
      }
    });
  });

  describe('Landing page should be NuConnect-focused', () => {
    test('app/page.tsx should contain NuConnect branding', () => {
      if (fs.existsSync('app/page.tsx')) {
        const pageContent = fs.readFileSync('app/page.tsx', 'utf8');
        
        expect(pageContent).toContain('NuConnect');
        expect(pageContent).toContain('professional connections');
        expect(pageContent).toContain('networking');
        
        // Should NOT contain Matrimoney references
        expect(pageContent).not.toContain('Matrimoney');
        expect(pageContent).not.toContain('couples');
        expect(pageContent).not.toContain('financial');
      }
    });
  });

  describe('Server routes should be updated', () => {
    test('server/routes.ts should reference NuConnect', () => {
      if (fs.existsSync('server/routes.ts')) {
        const routesContent = fs.readFileSync('server/routes.ts', 'utf8');
        
        expect(routesContent).toContain('NuConnect');
        
        // Should NOT contain Matrimoney references
        expect(routesContent).not.toContain('Matrimoney');
      }
    });
  });

  describe('Admin dashboards should be updated', () => {
    test('app/admin-dashboard/page.tsx should be NuConnect-focused', () => {
      if (fs.existsSync('app/admin-dashboard/page.tsx')) {
        const adminContent = fs.readFileSync('app/admin-dashboard/page.tsx', 'utf8');
        
        expect(adminContent).toContain('NuConnect');
        expect(adminContent).toContain('networking');
        
        // Should use NuConnect colors
        expect(adminContent).toContain('inkwell');
        expect(adminContent).toContain('lunar');
        expect(adminContent).toContain('aulait');
        
        // Should NOT contain Matrimoney references
        expect(adminContent).not.toContain('Matrimoney');
        expect(adminContent).not.toContain('questionnaire');
        expect(adminContent).not.toContain('couples');
      }
    });

    test('app/admin/page.tsx should be NuConnect-focused', () => {
      if (fs.existsSync('app/admin/page.tsx')) {
        const adminContent = fs.readFileSync('app/admin/page.tsx', 'utf8');
        
        expect(adminContent).toContain('NuConnect');
        expect(adminContent).toContain('networking');
        
        // Should use NuConnect colors
        expect(adminContent).toContain('inkwell');
        expect(adminContent).toContain('lunar');
        expect(adminContent).toContain('aulait');
        
        // Should NOT contain Matrimoney references
        expect(adminContent).not.toContain('Matrimoney');
        expect(adminContent).not.toContain('questionnaire');
        expect(adminContent).not.toContain('couples');
      }
    });
  });

  describe('Architecture documentation should be updated', () => {
    test('Architecture.md should reflect NuConnect purpose', () => {
      if (fs.existsSync('Architecture.md')) {
        const archContent = fs.readFileSync('Architecture.md', 'utf8');
        
        expect(archContent).toContain('NuConnect');
        expect(archContent).toContain('professional connections');
        expect(archContent).toContain('networking');
        expect(archContent).toContain('AI-powered matching');
        
        // Should contain NuConnect color palette
        expect(archContent).toContain('Inkwell');
        expect(archContent).toContain('Lunar Eclipse');
        expect(archContent).toContain('Crème Brûlée');
        expect(archContent).toContain('Au Lait');
        
        // Should NOT contain old Matrimoney references
        expect(archContent).not.toContain('Modern Matrimoney');
        expect(archContent).not.toContain('couples improve their financial');
        expect(archContent).not.toContain('Brand Teal');
        expect(archContent).not.toContain('Gold Light');
      }
    });
  });

  describe('API endpoints should be clean', () => {
    test('No Matrimoney-specific API routes should exist', () => {
      const matrimoneyRoutes = [
        'app/api/questionnaire',
        'app/api/contact',
        'app/api/professionals'
      ];

      matrimoneyRoutes.forEach(routePath => {
        if (fs.existsSync(routePath)) {
          // If directory exists, check it doesn't contain active routes
          const files = fs.readdirSync(routePath);
          const routeFiles = files.filter(f => f.endsWith('route.ts'));
          expect(routeFiles.length).toBe(0);
        }
      });
    });

    test('Auth routes should still exist and work', () => {
      const authRoutes = [
        'app/api/auth/login/route.ts',
        'app/api/auth/register/route.ts',
        'app/api/auth/validate/route.ts'
      ];

      authRoutes.forEach(routePath => {
        expect(fs.existsSync(routePath)).toBe(true);
      });
    });
  });

  describe('Package.json and dependencies', () => {
    test('package.json should not contain Matrimoney-specific dependencies', () => {
      if (fs.existsSync('package.json')) {
        const packageContent = fs.readFileSync('package.json', 'utf8');
        const packageJson = JSON.parse(packageContent);
        
        // Should still have core dependencies
        expect(packageJson.dependencies).toHaveProperty('next');
        expect(packageJson.dependencies).toHaveProperty('react');
        expect(packageJson.dependencies).toHaveProperty('typescript');
        
        // Check name if it was updated
        if (packageJson.name) {
          expect(packageJson.name.toLowerCase()).not.toContain('matrimoney');
        }
      }
    });
  });
});
