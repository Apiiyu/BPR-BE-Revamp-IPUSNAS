// Configuration Modules
import { AppConfigurationModule } from './configurations/app/app-configuration.module';
import { DatabasePostgresConfigModule } from './configurations/database/postgres/postgres-configuration.module';

// Modules
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { GenresModule } from './modules/genres/genres.module';
import { UserInterestsModule } from './modules/user-interests/user-interests.module';
import { UsersModule } from './modules/users/users.module';

// NestJS Libraries
import { Module } from '@nestjs/common';

// Providers
import { PostgresDatabaseProviderModule } from './database/postgres/postgres-provider.module';

@Module({
  imports: [
    // Configuration Modules
    AppConfigurationModule,
    DatabasePostgresConfigModule,
    PostgresDatabaseProviderModule,

    // Core Feature Modules
    AuthenticationModule,
    GenresModule,
    UserInterestsModule,
    UsersModule,
  ],
})
export class AppModule {}
