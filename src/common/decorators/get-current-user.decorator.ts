import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// decorator to get current user from JWT token
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);