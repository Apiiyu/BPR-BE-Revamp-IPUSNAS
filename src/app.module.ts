// Configuration Modules
import { AppConfigurationModule } from './configurations/app/app-configuration.module';
import { DatabasePostgresConfigModule } from './configurations/database/postgres/postgres-configuration.module';

// Modules
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { BooksModule } from './modules/books/books.module';
import { FilesModule } from './modules/files/files.module';
import { GenresModule } from './modules/genres/genres.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
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
    AuthorsModule,
    BookingsModule,
    BooksModule,
    FilesModule,
    GenresModule,
    NotificationsModule,
    UserInterestsModule,
    UsersModule,
  ],
})
export class AppModule {}
