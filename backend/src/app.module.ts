import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { NightclubsModule } from './modules/nightclubs/nightclubs.module';
import { EventsModule } from './modules/events/events.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TablesModule } from './modules/tables/tables.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                logging: configService.get<string>('NODE_ENV') === 'development',
            }),
        }),
        AuthModule,
        NightclubsModule,
        EventsModule,
        NotificationsModule,
        TablesModule,
        BookingsModule,
        FavoritesModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }

