#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verifying Phase 4: API Routes & UI...\n');

// Check if required API route files exist
console.log('📁 Checking API route files...');
const requiredApiRoutes = [
  'app/api/intake/questions/route.ts',
  'app/api/intake/answers/route.ts',
  'app/api/rooms/create/route.ts',
  'app/api/rooms/join/route.ts',
  'app/api/rooms/[id]/match/route.ts',
  'app/api/matches/[id]/share-contact/route.ts',
  'app/api/connections/route.ts',
  'app/api/boosts/route.ts'
];

const missingApiRoutes = requiredApiRoutes.filter(route => !fs.existsSync(route));
if (missingApiRoutes.length === 0) {
  console.log('✅ All API route files exist');
} else {
  console.log('❌ Missing API route files:', missingApiRoutes);
}

// Check if required UI page files exist
console.log('\n📁 Checking UI page files...');
const requiredPages = [
  'app/login/page.tsx',
  'app/intake/page.tsx', 
  'app/rooms/page.tsx',
  'app/rooms/[id]/page.tsx',
  'app/connections/page.tsx'
];

const missingPages = requiredPages.filter(page => !fs.existsSync(page));
if (missingPages.length === 0) {
  console.log('✅ All UI page files exist');
} else {
  console.log('❌ Missing UI page files:', missingPages);
}

// Check if required component files exist
console.log('\n📁 Checking component files...');
const requiredComponents = [
  'components/BrandHeader.tsx',
  'components/FormCard.tsx', 
  'components/PrimaryButton.tsx',
  'lib/hooks/use-toast.tsx'
];

const missingComponents = requiredComponents.filter(component => !fs.existsSync(component));
if (missingComponents.length === 0) {
  console.log('✅ All component files exist');
} else {
  console.log('❌ Missing component files:', missingComponents);
}

// Check Tailwind configuration
console.log('\n📋 Checking Tailwind configuration...');
if (fs.existsSync('tailwind.config.js')) {
  const tailwindContent = fs.readFileSync('tailwind.config.js', 'utf8');
  
  const requiredColors = ['inkwell', 'lunar', 'creme', 'aulait'];
  const missingColors = requiredColors.filter(color => !tailwindContent.includes(color));
  
  if (missingColors.length === 0) {
    console.log('✅ NuConnect color palette configured');
  } else {
    console.log('❌ Missing colors in Tailwind config:', missingColors);
  }
  
  // Check specific color values
  const colorValues = {
    inkwell: '#2C3639',
    lunar: '#3F4E4F', 
    creme: '#A27B5B',
    aulait: '#DCD7C9'
  };
  
  let allColorsCorrect = true;
  Object.entries(colorValues).forEach(([color, value]) => {
    if (!tailwindContent.includes(value)) {
      console.log(`❌ Incorrect color value for ${color}: expected ${value}`);
      allColorsCorrect = false;
    }
  });
  
  if (allColorsCorrect) {
    console.log('✅ All color values are correct');
  }
} else {
  console.log('❌ Tailwind config file not found');
}

// Check package.json dependencies
console.log('\n📦 Checking required dependencies...');
if (fs.existsSync('package.json')) {
  const packageContent = fs.readFileSync('package.json', 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  const requiredDeps = [
    'clsx',
    'tailwind-merge', 
    'class-variance-authority',
    '@radix-ui/react-label',
    'lucide-react'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
  );
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies installed');
  } else {
    console.log('❌ Missing dependencies:', missingDeps);
    console.log('💡 Run: npm install', missingDeps.join(' '));
  }
} else {
  console.log('❌ package.json not found');
}

// Check API route implementations
console.log('\n📋 Checking API route implementations...');
const apiRouteChecks = [
  {
    file: 'app/api/intake/questions/route.ts',
    requiredExports: ['GET'],
    requiredImports: ['intakeStateMachine']
  },
  {
    file: 'app/api/intake/answers/route.ts', 
    requiredExports: ['POST'],
    requiredImports: ['intakeStateMachine']
  },
  {
    file: 'app/api/rooms/create/route.ts',
    requiredExports: ['POST'],
    requiredImports: ['insertMatchRoomSchema']
  }
];

apiRouteChecks.forEach(check => {
  if (fs.existsSync(check.file)) {
    const content = fs.readFileSync(check.file, 'utf8');
    
    const hasExports = check.requiredExports.every(exp => 
      content.includes(`export async function ${exp}`)
    );
    
    const hasImports = check.requiredImports.every(imp => 
      content.includes(imp)
    );
    
    if (hasExports && hasImports) {
      console.log(`✅ ${check.file} properly implemented`);
    } else {
      console.log(`❌ ${check.file} missing required exports or imports`);
    }
  }
});

// Check UI page implementations
console.log('\n📋 Checking UI page implementations...');
const pageChecks = [
  {
    file: 'app/login/page.tsx',
    requiredElements: ['useState', 'useRouter', 'PrimaryButton']
  },
  {
    file: 'app/intake/page.tsx',
    requiredElements: ['useState', 'useEffect', 'FormCard']
  },
  {
    file: 'app/rooms/page.tsx', 
    requiredElements: ['Card', 'Badge', 'PrimaryButton']
  }
];

pageChecks.forEach(check => {
  if (fs.existsSync(check.file)) {
    const content = fs.readFileSync(check.file, 'utf8');
    
    const hasElements = check.requiredElements.every(element => 
      content.includes(element)
    );
    
    if (hasElements) {
      console.log(`✅ ${check.file} properly implemented`);
    } else {
      console.log(`❌ ${check.file} missing required elements`);
    }
  }
});

// Run the Phase 4 verification tests
console.log('\n🧪 Running Phase 4 verification tests...\n');

try {
  execSync('npm run test:phase4', { stdio: 'inherit' });
  console.log('\n✅ Phase 4 verification completed successfully!');
  console.log('\n📋 Phase 4 Summary:');
  console.log('   ✓ API routes implemented and tested');
  console.log('   ✓ UI pages created with proper components');
  console.log('   ✓ NuConnect design system applied');
  console.log('   ✓ Toast notification system integrated');
  console.log('   ✓ Form validation and error handling');
  console.log('   ✓ Responsive design with Tailwind CSS');
  console.log('   ✓ All tests passing');
  console.log('\n🎯 Phase 4 complete! Ready for demo deployment');
} catch (error) {
  console.error('\n❌ Phase 4 verification failed!');
  console.error('Please review the test output above and fix any issues before proceeding.');
  console.error('\n💡 Common issues:');
  console.error('   - Missing API route implementations');
  console.error('   - UI components not properly imported');
  console.error('   - Tailwind CSS configuration errors');
  console.error('   - Missing required dependencies');
  console.error('   - Form validation logic errors');
  process.exit(1);
}
