import { Link } from 'react-router-dom';

interface HeroSectionProps {
  backgroundImage: string;
}

export const HeroSection = ({ backgroundImage }: HeroSectionProps) => {
  return (
    <section
      className="relative w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 mb-10 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/80 to-primary-900/85"></div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
            Dubai Villas
          </h1>
          <div className="w-20 h-1 bg-white/40 mx-auto rounded-full">
            <div className="w-12 h-1 bg-white mx-auto rounded-full"></div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            Your premier destination for finding the perfect property in Dubai. Browse listings, create free requests,
            and connect with trusted agents to find your dream property.
          </p>
          <div className="pt-4">
            <Link
              to="/request/new"
              className="inline-flex items-center gap-2.5 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform whitespace-nowrap"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              List Your Request (It's free!)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

