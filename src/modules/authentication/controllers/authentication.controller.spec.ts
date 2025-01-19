// Controllers
import { AuthenticationController } from './authentication.controller';

// DTOs
import { LoginEmailDto } from '../dtos/login.dto';

// NestJS Libraries
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

// Modules
import { JwtConfigModule } from '../../../configurations/jwt/jwt-configuration.module';

// Services
import { AuthenticationService } from '../services/authentication.service';
import { UsersService } from '../../users/services/users.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtConfigModule,
        PassportModule,
        JwtModule.register({
          secretOrPrivateKey: 'secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: UsersService) =>
                Promise.resolve({ id: '1', ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                email: 'email #1',
                name: 'name #1',
              },
              {
                email: 'email #2',
                name: 'name #2',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                email: 'email #1',
                name: 'name #1',
                id,
              }),
            ),
            findOneByEmail: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                email: 'email #1',
                name: 'name #1',
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
      controllers: [AuthenticationController],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('[POST] /authentication/login', () => {
    it('should return a accessToken', async () => {
      const body = new LoginEmailDto();
      body.email = 'email@test.com';
      body.password = 'secret';

      const request: ICustomRequestHeaders = {
        keepalive: true,
        bodyUsed: true,
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        destination: 'document',
        user: {
          id: '1',
          username: 'user name',
          email: 'test@mailnesia.com',
        },
        mode: 'cors',
        redirect: 'follow',
        integrity: '',
        referrer: 'client',
        url: 'http://localhost:3000/authentication/login',
        referrerPolicy: 'strict-origin-when-cross-origin',
        clone: jest.fn(),
        signal: new AbortSignal(),
        headers: new Headers(),
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        bytes: jest.fn(),
        json: jest.fn(),
        text: jest.fn(),
        body: null,
      };

      const response = await controller.login(body, request);

      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('result');
      expect(response.message).toBe('User logged in successfully');
      expect(response.result).toHaveProperty('accessToken');
    });
  });
});
