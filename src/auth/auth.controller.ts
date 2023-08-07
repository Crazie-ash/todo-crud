import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
@ApiTags('Authentication') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'User login credentials',
    type: AuthLoginDto
  })
  @ApiResponse({ status: 200, description: 'Login successful' }) 
  @ApiResponse({ status: 401, description: 'Unauthorized' }) 
  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    const response = await this.authService.login(body);
    return response;
  }
}
