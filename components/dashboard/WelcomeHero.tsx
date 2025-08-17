interface WelcomeHeroProps {
  name: string;
  ctaHref: string;
}

export function WelcomeHero({ name, ctaHref }: WelcomeHeroProps) {
  return (
    <div className="bg-gradient-to-r from-inkwell to-lunar text-aulait p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, {name}!</h1>
          <p className="text-aulait/80 mb-4">Ready to make meaningful connections?</p>
        </div>
        <div>
          <a
            href={ctaHref}
            className="bg-creme hover:bg-creme/90 text-inkwell px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Find Matches
          </a>
        </div>
      </div>
    </div>
  );
}
