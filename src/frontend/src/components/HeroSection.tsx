export default function HeroSection() {
  return (
    <div className="hero-section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <div className="container relative mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Property Development Excellence
        </h1>
        <p className="mt-4 text-lg text-white/90 md:text-xl">
          Manage properties, projects, tasks, and teams with precision and efficiency
        </p>
      </div>
    </div>
  );
}
