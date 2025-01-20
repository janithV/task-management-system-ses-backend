import { SetMetadata } from '@nestjs/common';

// decorator to allow public access to any given endpoint
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
