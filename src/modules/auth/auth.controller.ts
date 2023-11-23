import { Controller, Get } from '@nestjs/common';

import { AuthHttpService } from './auth-http.service';

@Controller()
export class AuthController {
  constructor(private readonly authHttpService: AuthHttpService) {}

  @Get('token')
  getToken() {
    return this.authHttpService.getToken();
  }
}
