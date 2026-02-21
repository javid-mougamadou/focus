import { THEME_SUBTITLE_COLORS, THEME_TEXT_COLORS } from '../constants';
import type { Theme } from '../constants';

type HeroProps = {
  theme: Theme;
};

const Hero = ({ theme }: HeroProps) => {
  const titleColor = THEME_TEXT_COLORS[theme];
  const subtitleColor = THEME_SUBTITLE_COLORS[theme];

  return (
    <section className="flex w-full flex-1 items-center justify-center">
      <div className="w-full px-4 text-center">
        <h1 className={`mb-5 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl ${titleColor}`}>
          Hello World focus
        </h1>
        <p className={`mt-4 text-base opacity-80 sm:text-lg ${subtitleColor}`}>
          Focus PWA by Javid Mougamadou
        </p>
      </div>
    </section>
  );
};

export default Hero;
