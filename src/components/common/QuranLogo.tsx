import { cn } from '@/lib/utils';

interface QuranLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function QuranLogo({ className, ...props }: QuranLogoProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 200 200'
      fill='none'
      className={cn('w-full h-full', className)}
      {...props}
    >
      {/* Rays of Light (Sunburst) */}
      <g className='text-emerald-300 dark:text-emerald-400 opacity-60'>
        <path
          d='M100 110 L100 75'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M100 110 L80 82'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M100 110 L120 82'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M100 110 L60 95'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M100 110 L140 95'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
        />
      </g>

      {/* Mosque Arch */}
      <path
        d='M40 160 V 90 Q 40 30 100 10 Q 160 30 160 90 V 160'
        stroke='currentColor'
        strokeWidth='8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-emerald-800 dark:text-white'
      />
      {/* Arch Base/Feet */}
      <path
        d='M30 160 H 50'
        stroke='currentColor'
        strokeWidth='8'
        strokeLinecap='round'
        className='text-emerald-800 dark:text-white'
      />
      <path
        d='M150 160 H 170'
        stroke='currentColor'
        strokeWidth='8'
        strokeLinecap='round'
        className='text-emerald-800 dark:text-white'
      />

      {/* Crescent Moon & Star */}
      <g className='text-emerald-600 dark:text-emerald-300'>
        <path
          d='M100 65 A 12 12 0 1 1 95 45 A 10 10 0 1 0 100 65 Z'
          fill='currentColor'
        />
        <circle
          cx='100'
          cy='40'
          r='3'
          fill='currentColor'
        />
      </g>

      {/* Book Stand (Rehal) - X shape */}
      <path
        d='M60 150 L 140 115'
        stroke='currentColor'
        strokeWidth='5'
        strokeLinecap='round'
        className='text-emerald-700 dark:text-emerald-200'
      />
      <path
        d='M140 150 L 60 115'
        stroke='currentColor'
        strokeWidth='5'
        strokeLinecap='round'
        className='text-emerald-700 dark:text-emerald-200'
      />

      {/* Book (Open Pages) */}
      <path
        d='M50 115 Q 75 130 100 115 Q 125 130 150 115 L 145 105 Q 125 120 100 105 Q 75 120 55 105 Z'
        fill='currentColor'
        className='text-emerald-500 dark:text-emerald-400'
        opacity='0.9'
      />
      {/* Book Center Line */}
      <path
        d='M100 115 V 105'
        stroke='currentColor'
        strokeWidth='2'
        className='text-emerald-800 dark:text-emerald-900'
      />
    </svg>
  );
}
