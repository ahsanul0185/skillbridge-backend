var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import "dotenv/config";

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";

// src/lib/auth.ts
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// generated/prisma/enums.ts
var UserRoles = {
  ADMIN: "ADMIN",
  TUTOR: "TUTOR",
  STUDENT: "STUDENT"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED"
};
var AvailabilityStatus = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED"
};
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  phone         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role            UserRoles\n  status          UserStatus     @default(ACTIVE)\n  tutorProfile    TutorProfiles?\n  studentBookings Booking[]\n  studentReviews  Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRoles {\n  ADMIN\n  TUTOR\n  STUDENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel Availability {\n  id        String             @id @default(uuid())\n  tutorId   String\n  day       WeekDay\n  startTime String\n  endTime   String\n  status    AvailabilityStatus @default(AVAILABLE)\n\n  tutor   TutorProfiles @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  booking Booking[]\n\n  @@index([tutorId])\n  @@map("availability")\n}\n\nenum AvailabilityStatus {\n  AVAILABLE\n  BOOKED\n}\n\nenum WeekDay {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n  SUNDAY\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  tutorId        String\n  subjectId      String?\n  availabilityId String?\n  status         BookingStatus @default(CONFIRMED)\n  price          Int\n  createdAt      DateTime      @default(now())\n  completedAt    DateTime?\n\n  student      User          @relation(fields: [studentId], references: [id])\n  tutor        TutorProfiles @relation(fields: [tutorId], references: [id])\n  subject      Subject?      @relation(fields: [subjectId], references: [id])\n  availability Availability? @relation(fields: [availabilityId], references: [id], onDelete: SetNull)\n  review       Review?\n\n  @@index([studentId, tutorId])\n  @@map("bookings")\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nmodel Category {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  description String?\n  createdAt   DateTime @default(now())\n\n  tutors   TutorProfiles[]\n  subjects Subject[]\n\n  @@map("categories")\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  bookingId String   @unique\n  studentId String\n  tutorId   String\n  rating    Decimal  @db.Decimal(2, 1)\n  review    String\n  createdAt DateTime @default(now())\n\n  student User          @relation(fields: [studentId], references: [id])\n  tutor   TutorProfiles @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  booking Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@index([studentId])\n  @@index([tutorId])\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Subject {\n  id         String   @id @default(uuid())\n  name       String   @unique\n  categoryId String\n  createdAt  DateTime @default(now())\n\n  category Category       @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  tutors   TutorSubject[]\n  bookings Booking[]\n\n  @@index([categoryId])\n  @@map("subjects")\n}\n\nmodel TutorProfiles {\n  id           String   @id @default(uuid())\n  userId       String   @unique\n  bio          String?\n  hourlyRate   Int?\n  categoryId   String?\n  isFeatured   Boolean  @default(false)\n  avgRating    Decimal  @default(0) @db.Decimal(2, 1)\n  totalReviews Int      @default(0)\n  createdAt    DateTime @default(now())\n\n  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n  category     Category?      @relation(fields: [categoryId], references: [id])\n  availability Availability[]\n  bookings     Booking[]\n  reviews      Review[]\n  subjects     TutorSubject[]\n\n  @@index([categoryId])\n  @@map("tutor_profiles")\n}\n\nmodel TutorSubject {\n  tutorId   String\n  subjectId String\n\n  tutor   TutorProfiles @relation(fields: [tutorId], references: [id])\n  subject Subject       @relation(fields: [subjectId], references: [id])\n\n  @@id([tutorId, subjectId])\n  @@map("tutor_subjects")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"UserRoles"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"tutorProfile","kind":"object","type":"TutorProfiles","relationName":"TutorProfilesToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"studentReviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"day","kind":"enum","type":"WeekDay"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AvailabilityStatus"},{"name":"tutor","kind":"object","type":"TutorProfiles","relationName":"AvailabilityToTutorProfiles"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"}],"dbName":"availability"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"subjectId","kind":"scalar","type":"String"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"price","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"tutor","kind":"object","type":"TutorProfiles","relationName":"BookingToTutorProfiles"},{"name":"subject","kind":"object","type":"Subject","relationName":"BookingToSubject"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorProfiles","relationName":"CategoryToTutorProfiles"},{"name":"subjects","kind":"object","type":"Subject","relationName":"CategoryToSubject"}],"dbName":"categories"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Decimal"},{"name":"review","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutor","kind":"object","type":"TutorProfiles","relationName":"ReviewToTutorProfiles"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"}],"dbName":"reviews"},"Subject":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToSubject"},{"name":"tutors","kind":"object","type":"TutorSubject","relationName":"SubjectToTutorSubject"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToSubject"}],"dbName":"subjects"},"TutorProfiles":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"avgRating","kind":"scalar","type":"Decimal"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfilesToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfiles"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfiles"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfiles"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfiles"},{"name":"subjects","kind":"object","type":"TutorSubject","relationName":"TutorProfilesToTutorSubject"}],"dbName":"tutor_profiles"},"TutorSubject":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"subjectId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfiles","relationName":"TutorProfilesToTutorSubject"},{"name":"subject","kind":"object","type":"Subject","relationName":"SubjectToTutorSubject"}],"dbName":"tutor_subjects"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubjectScalarFieldEnum: () => SubjectScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfilesScalarFieldEnum: () => TutorProfilesScalarFieldEnum,
  TutorSubjectScalarFieldEnum: () => TutorSubjectScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Availability: "Availability",
  Booking: "Booking",
  Category: "Category",
  Review: "Review",
  Subject: "Subject",
  TutorProfiles: "TutorProfiles",
  TutorSubject: "TutorSubject"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  phone: "phone",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorId: "tutorId",
  day: "day",
  startTime: "startTime",
  endTime: "endTime",
  status: "status"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  subjectId: "subjectId",
  availabilityId: "availabilityId",
  status: "status",
  price: "price",
  createdAt: "createdAt",
  completedAt: "completedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorId: "tutorId",
  rating: "rating",
  review: "review",
  createdAt: "createdAt"
};
var SubjectScalarFieldEnum = {
  id: "id",
  name: "name",
  categoryId: "categoryId",
  createdAt: "createdAt"
};
var TutorProfilesScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  hourlyRate: "hourlyRate",
  categoryId: "categoryId",
  isFeatured: "isFeatured",
  avgRating: "avgRating",
  totalReviews: "totalReviews",
  createdAt: "createdAt"
};
var TutorSubjectScalarFieldEnum = {
  tutorId: "tutorId",
  subjectId: "subjectId"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { createAuthMiddleware } from "better-auth/api";

// src/utils/sendVerificationEmail.tsx
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var getEmailTemplate = (userName, verificationUrl) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - SkillBridge</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 60px 20px;">
                <table role="presentation" style="width: 540px; max-width: 100%; border-collapse: collapse;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 0 0 48px; text-align: left;">
                            <h1 style="margin: 0; color: #000000; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">SkillBridge</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0;">
                            <h2 style="margin: 0 0 16px; color: #000000; font-size: 26px; font-weight: 500; letter-spacing: -0.5px; line-height: 1.3;">
                                Verify your email
                            </h2>
                            
                            <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                                Hi ${userName}, welcome to SkillBridge.
                            </p>
                            
                            <p style="margin: 0 0 32px; color: #666666; font-size: 16px; line-height: 1.5;">
                                Click the button below to verify your email address and get started.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 0 0 32px;">
                                <tr>
                                    <td>
                                        <a href="${verificationUrl}" style="display: inline-block; padding: 14px 28px; background-color: #088395; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500;">
                                            Verify email address
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 8px; color: #999999; font-size: 14px; line-height: 1.5;">
                                Or copy this link:
                            </p>
                            
                            <p style="margin: 0 0 40px; color: #999999; font-size: 13px; word-break: break-all; line-height: 1.5;">
                                ${verificationUrl}
                            </p>
                            
                            <!-- Divider -->
                            <table role="presentation" style="width: 100%; margin: 0 0 32px;">
                                <tr>
                                    <td style="border-top: 1px solid #e5e7eb;"></td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 24px; color: #999999; font-size: 14px; line-height: 1.5;">
                                This link expires in 24 hours. If you didn't create this account, you can ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 0 0;">
                            <p style="margin: 0 0 8px; color: #999999; font-size: 13px;">
                                Questions? <a href="mailto:support@skillbridge.com" style="color: #000000; text-decoration: none;">Contact support</a>
                            </p>
                            <p style="margin: 0; color: #cccccc; font-size: 13px;">
                                \xA9 2026 SkillBridge
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
var sendVerificationEmail = async ({ user, url, token }) => {
  try {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    const info = await transporter.sendMail({
      from: '"SkillBridge" <skillbridge@mail.com>',
      to: user.email,
      subject: "Verify Your Email Address - SkillBridge",
      text: `Hi ${user.name},

Thank you for signing up with SkillBridge! Please verify your email address by clicking this link: ${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

Best regards,
The SkillBridge Team`,
      html: getEmailTemplate(user.name, url)
    });
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.log(error);
  }
};
var sendVerificationEmail_default = sendVerificationEmail;

// src/lib/auth.ts
import "dotenv/config";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // trustedOrigins : [process.env.APP_URL!],
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins2 = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000",
      "https://skillbridge-frontend-murex.vercel.app",
      "https://skillbridge-frontend-murex.vercel.app"
    ].filter(Boolean);
    if (!origin || allowedOrigins2.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return [origin];
    }
    return [];
  },
  basePath: "/api/auth",
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
    // requireEmailVerification : true
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(url);
      sendVerificationEmail_default({ user: { ...user, image: user.image ?? null }, url, token });
    },
    autoSignInAfterVerification: true
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        if (ctx.body.role === UserRoles.ADMIN && process.env.ALLOW_ADMIN_SEED !== "true") {
          throw new APIError("BAD_REQUEST", {
            message: "You can't sign up as admin"
          });
        }
      }
    })
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            if (user.role === UserRoles.TUTOR) {
              await prisma.tutorProfiles.create({
                data: {
                  userId: user.id
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }
});

// src/modules/user/user.router.ts
import { Router } from "express";

// src/modules/user/user.service.ts
var listUsers = async ({
  page,
  limit,
  sortBy,
  skip,
  sortOrder
}) => {
  const total = await prisma.user.count({});
  const result = await prisma.user.findMany({
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUser = async (user) => {
  return await prisma.user.findUnique({
    where: {
      id: user.id
    },
    include: {
      studentReviews: user.role === UserRoles.STUDENT,
      studentBookings: user.role === UserRoles.STUDENT,
      tutorProfile: user.role === UserRoles.TUTOR && {
        include: {
          subjects: {
            include: {
              subject: true
            }
          }
        }
      }
    }
  });
};
var updateUserData = async (data, user) => {
  const { name, image, phone } = data;
  if (!name && !image && !phone) {
    throw new Error("Invalid input fields");
  }
  const userExists = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id
    }
  });
  return await prisma.user.update({
    where: {
      id: userExists.id
    },
    data: {
      ...name && { name },
      ...image && { image },
      ...phone && { phone }
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      phone: true
    }
  });
};
var updateUserStatus = async (status, userId) => {
  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status
    }
  });
};
var getStudentStats = async (studentId) => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalBookings,
      upcomingBookings,
      completedBookings,
      totalSpent,
      totalReviews
    ] = await Promise.all([
      tx.booking.count({ where: { studentId } }),
      tx.booking.findMany({
        where: { studentId, status: BookingStatus.CONFIRMED },
        take: 5,
        orderBy: {
          createdAt: "asc"
        },
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          },
          subject: {
            select: {
              name: true
            }
          },
          availability: {
            select: {
              day: true,
              startTime: true,
              endTime: true
            }
          }
        }
      }),
      tx.booking.count({
        where: {
          studentId,
          status: BookingStatus.COMPLETED
        }
      }),
      tx.booking.aggregate({
        where: { studentId },
        _sum: {
          price: true
        }
      }),
      tx.review.count({
        where: { studentId }
      })
    ]);
    return {
      totalBookings,
      upcomingBookings,
      completedBookings,
      totalSpent: totalSpent._sum.price || 0,
      totalReviews
    };
  });
};
var getAdminAnalytics = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      completedBookings,
      totalRevenue,
      totalReviews,
      averageRating
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({
        where: { role: "STUDENT" }
      }),
      tx.user.count({
        where: { role: "TUTOR" }
      }),
      tx.booking.count(),
      tx.booking.count({
        where: { status: "COMPLETED" }
      }),
      tx.booking.aggregate({
        _sum: {
          price: true
        }
      }),
      tx.review.count(),
      tx.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ]);
    return {
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      completedBookings,
      totalRevenue: totalRevenue._sum.price || 0,
      totalReviews,
      averageRating: averageRating._avg.rating || 0
    };
  });
};
var userService = {
  getUser,
  listUsers,
  updateUserStatus,
  updateUserData,
  getStudentStats,
  getAdminAnalytics
};

// src/utils/paginationHelper.tsx
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return { page, limit, skip, sortBy, sortOrder };
};
var paginationHelper_default = paginationSortingHelper;

// src/modules/user/user.controller.ts
var getUser2 = async (req, res, next) => {
  try {
    const result = await userService.getUser(req.user);
    return res.status(200).json({ success: true, message: "User data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var listUsers2 = async (req, res, next) => {
  try {
    const paginations = paginationHelper_default(req.query);
    const result = await userService.listUsers(paginations);
    return res.status(200).json({ success: true, message: "Users data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    if (!req.body?.status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }
    const result = await userService.updateUserStatus(req.body.status, req.params.userId);
    return res.status(200).json({ success: true, message: "User status updated", data: result });
  } catch (e) {
    next(e);
  }
};
var updateUserData2 = async (req, res, next) => {
  try {
    const result = await userService.updateUserData(req.body, req.user);
    return res.status(200).json({ success: true, message: "Updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var getStudentStats2 = async (req, res, next) => {
  try {
    const result = await userService.getStudentStats(req.user?.id);
    return res.status(200).json({ success: true, message: "Student stats retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var getAdminAnalytics2 = async (req, res, next) => {
  try {
    const result = await userService.getAdminAnalytics();
    return res.status(200).json({ success: true, message: "Admin analytics retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var userController = { getUser: getUser2, listUsers: listUsers2, updateUserStatus: updateUserStatus2, updateUserData: updateUserData2, getStudentStats: getStudentStats2, getAdminAnalytics: getAdminAnalytics2 };

// src/middlewares/auth.ts
var auth3 = (...roles) => {
  return async (req, res, next) => {
    try {
      console.log(req.headers);
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }
      req.user = session.user;
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to perform this action."
        });
      }
      if (req.user.role === UserRoles.TUTOR) {
        const tutorProfile = await prisma.tutorProfiles.findUnique({
          where: {
            userId: req.user.id
          },
          select: {
            id: true
          }
        });
        if (tutorProfile) {
          req.tutorId = tutorProfile.id;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/user/user.router.ts
var router = Router();
router.get("/me", auth3(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN), userController.getUser);
router.put("/update", auth3(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN), userController.updateUserData);
router.get("/student/stats", auth3(UserRoles.STUDENT), userController.getStudentStats);
router.get("/admin/analytics", auth3(UserRoles.ADMIN), userController.getAdminAnalytics);
router.get("/list", auth3(UserRoles.ADMIN), userController.listUsers);
router.put("/ban/:userId", auth3(UserRoles.ADMIN), userController.updateUserStatus);
var userRouter = router;

// src/modules/tutor/tutor.router.ts
import { Router as Router2 } from "express";

// src/modules/tutor/tutor.service.ts
var getAllTutors = async ({ search, hourlyRate, categoryId, isFeatured, avgRating, totalReviews, subjectId, page, limit, sortBy, skip, sortOrder }) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        },
        {
          bio: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (subjectId) {
    andConditions.push({
      subjects: {
        some: {
          subjectId
        }
      }
    });
  }
  if (hourlyRate) {
    andConditions.push({
      hourlyRate: {
        lte: hourlyRate
      }
    });
  }
  if (categoryId) {
    andConditions.push({
      categoryId
    });
  }
  if (isFeatured !== null) {
    andConditions.push({
      isFeatured
    });
  }
  if (avgRating) {
    andConditions.push({
      avgRating: {
        gte: avgRating
      }
    });
  }
  if (totalReviews) {
    andConditions.push({
      totalReviews: {
        gte: totalReviews
      }
    });
  }
  andConditions.push({
    user: {
      status: UserStatus.ACTIVE
    }
  });
  const result = await prisma.tutorProfiles.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      user: true,
      availability: true,
      category: true,
      _count: {
        select: {
          reviews: true
        }
      }
    }
  });
  const total = await prisma.tutorProfiles.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getTutorById = async (tutorId) => {
  return await prisma.tutorProfiles.findUnique({
    where: {
      id: tutorId
    },
    include: {
      user: true,
      category: true,
      availability: true,
      reviews: {
        include: {
          student: true
        }
      },
      subjects: {
        include: {
          subject: true
        }
      }
    }
  });
};
var updateTutor = async (data, user) => {
  if (user.role !== UserRoles.ADMIN) {
    delete data.isFeatured;
    delete data.avgRating;
    delete data.totalReviews;
  }
  return await prisma.tutorProfiles.update({
    where: {
      userId: user.id
    },
    data
  });
};
var updateTutorSubjects = async (subjectIds, user) => {
  const tutorProfile = await prisma.tutorProfiles.findUnique({
    where: {
      userId: user.id
    }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  if (!tutorProfile.categoryId) {
    throw new Error("Tutor profile category not found");
  }
  const subjects = await prisma.subject.findMany({
    where: {
      id: { in: subjectIds }
    },
    select: {
      id: true,
      categoryId: true
    }
  });
  if (subjects.length !== subjectIds.length) {
    throw new Error("One or more subjects are invalid");
  }
  const invalidSubject = subjects.find(
    (s) => s.categoryId !== tutorProfile.categoryId
  );
  if (invalidSubject) {
    throw new Error("You selected a subject outside your category");
  }
  return await prisma.$transaction(async (tx) => {
    await tx.tutorSubject.deleteMany({
      where: {
        tutorId: tutorProfile.id
      }
    });
    const data = subjectIds.map((subjectId) => ({ tutorId: tutorProfile.id, subjectId }));
    return await tx.tutorSubject.createManyAndReturn({
      data
    });
  });
};
var deleteTutorSubject = async (subjectId, user) => {
  const tutorProfile = await prisma.tutorProfiles.findUnique({
    where: { userId: user.id }
  });
  if (!tutorProfile) {
    throw new Error("Tutor not found");
  }
  return await prisma.tutorSubject.delete({
    where: {
      tutorId_subjectId: {
        tutorId: tutorProfile.id,
        subjectId
      }
    }
  });
};
var featureTutor = async (isFeatured, tutorId) => {
  return await prisma.tutorProfiles.update({
    where: {
      id: tutorId
    },
    data: {
      isFeatured
    }
  });
};
var getTutorDashboardOverview = async (user) => {
  const tutorProfile = await prisma.tutorProfiles.findUnique({
    where: {
      userId: user.id
    },
    select: {
      id: true,
      bio: true,
      hourlyRate: true,
      avgRating: true,
      totalReviews: true,
      isFeatured: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      subjects: {
        select: {
          subject: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  return await prisma.$transaction(async (tx) => {
    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
      totalEarnings,
      recentReviews,
      availabilities
    ] = await Promise.all([
      tx.booking.count({
        where: {
          tutorId: tutorProfile.id
        }
      }),
      tx.booking.count({
        where: {
          tutorId: tutorProfile.id,
          status: "COMPLETED"
        }
      }),
      tx.booking.count({
        where: {
          tutorId: tutorProfile.id,
          status: "CANCELLED"
        }
      }),
      tx.booking.findMany({
        where: {
          tutorId: tutorProfile.id,
          status: "CONFIRMED"
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5,
        select: {
          id: true,
          price: true,
          status: true,
          createdAt: true,
          completedAt: true,
          student: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          availability: {
            select: {
              day: true,
              startTime: true,
              endTime: true
            }
          }
        }
      }),
      tx.booking.aggregate({
        where: {
          tutorId: tutorProfile.id,
          status: "COMPLETED"
        },
        _sum: {
          price: true
        }
      }),
      tx.review.findMany({
        where: {
          tutorId: tutorProfile.id
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5,
        select: {
          id: true,
          rating: true,
          review: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      }),
      tx.availability.findMany({
        where: {
          tutorId: tutorProfile.id
        },
        orderBy: {
          day: "asc"
        },
        select: {
          id: true,
          day: true,
          startTime: true,
          endTime: true,
          status: true
        }
      })
    ]);
    const activeAvailabilities = availabilities.filter((a) => a.status === AvailabilityStatus.AVAILABLE);
    return {
      profile: {
        bio: tutorProfile.bio,
        hourlyRate: tutorProfile.hourlyRate,
        avgRating: tutorProfile.avgRating,
        totalReviews: tutorProfile.totalReviews,
        isFeatured: tutorProfile.isFeatured,
        category: tutorProfile.category,
        subjects: tutorProfile.subjects.map((tutorSubejct) => tutorSubejct.subject)
      },
      stats: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        upcomingCount: upcomingBookings.length,
        totalEarnings: totalEarnings._sum.price ?? 0
      },
      upcomingBookings,
      recentReviews,
      availability: {
        total: availabilities.length,
        activeSlots: activeAvailabilities.length,
        slots: availabilities
      }
    };
  });
};
var tutorService = { getAllTutors, getTutorById, updateTutor, updateTutorSubjects, deleteTutorSubject, featureTutor, getTutorDashboardOverview };

// src/modules/tutor/tutor.controller.ts
var getAllTutors2 = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search ? req.query.search : null,
      hourlyRate: req.query.hourlyRate ? Number(req.query.hourlyRate) : null,
      categoryId: req.query.categoryId ? req.query.categoryId : null,
      isFeatured: req.query.isFeatured ? req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : null : null,
      avgRating: req.query.avgRating ? Number(req.query.avgRating) : null,
      totalReviews: req.query.totalReviews ? Number(req.query.totalReviews) : null,
      subjectId: req.query.subjectId ? req.query.subjectId : null
    };
    const paginations = paginationHelper_default(req.query);
    const result = await tutorService.getAllTutors({ ...filters, ...paginations });
    if (result.data.length < 1) {
      return res.status(200).json({ success: true, message: "No tutors found", data: [] });
    }
    return res.status(200).json({ success: true, message: "Tutors data retrieved successfully", data: result.data, pagination: result.pagination });
  } catch (e) {
    next(e);
  }
};
var getTutorById2 = async (req, res, next) => {
  try {
    const result = await tutorService.getTutorById(req.params.tutorId);
    if (result === null) {
      return res.status(400).json({ success: false, message: "Tutor not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Tutors data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateTutor2 = async (req, res, next) => {
  try {
    const result = await tutorService.updateTutor(req.body, req.user);
    return res.status(200).json({ success: true, message: "Tutors data updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateTutorSubjects2 = async (req, res, next) => {
  try {
    const { subjectIds } = req.body;
    if (!Array.isArray(subjectIds) || subjectIds.length === 0 || !subjectIds.every((id) => typeof id === "string")) {
      return res.status(400).json({
        success: false,
        message: "Invalid format. Expected: subjectIds: ['id1', 'id2']"
      });
    }
    const result = await tutorService.updateTutorSubjects(subjectIds, req.user);
    return res.status(200).json({ success: true, message: "Subjects updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteTutorSubject2 = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    if (!subjectId || typeof subjectId !== "string") {
      return res.status(400).json({
        success: false,
        message: "subjectId is required"
      });
    }
    const result = await tutorService.deleteTutorSubject(subjectId, req.user);
    return res.status(200).json({ success: true, message: "Subject deleted successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var featureTutor2 = async (req, res, next) => {
  try {
    if (Object.keys(req.body).some((key) => key !== "isFeatured")) {
      return res.status(400).json({
        success: false,
        message: "Invalid field input. Only isFeatured is allowed."
      });
    }
    const result = await tutorService.featureTutor(req.body.isFeatured, req.params.tutorId);
    return res.status(200).json({ success: true, message: "Tutor featured status updated", data: result });
  } catch (e) {
    next(e);
  }
};
var getTutorDashboardOverview2 = async (req, res, next) => {
  try {
    const result = await tutorService.getTutorDashboardOverview(req.user);
    return res.status(200).json({ success: true, message: "Retrieved tutors overview successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var tutorController = { getAllTutors: getAllTutors2, getTutorById: getTutorById2, updateTutor: updateTutor2, updateTutorSubjects: updateTutorSubjects2, deleteTutorSubject: deleteTutorSubject2, featureTutor: featureTutor2, getTutorDashboardOverview: getTutorDashboardOverview2 };

// src/modules/tutor/tutor.router.ts
var router2 = Router2();
router2.get("/", tutorController.getAllTutors);
router2.get("/overview", auth3(UserRoles.TUTOR), tutorController.getTutorDashboardOverview);
router2.get("/:tutorId", tutorController.getTutorById);
router2.put("/update", auth3(UserRoles.TUTOR), tutorController.updateTutor);
router2.put("/subjects", auth3(UserRoles.TUTOR), tutorController.updateTutorSubjects);
router2.put("/feature/:tutorId", auth3(UserRoles.ADMIN), tutorController.featureTutor);
router2.delete("/subjects/:subjectId", auth3(UserRoles.TUTOR), tutorController.deleteTutorSubject);
var tutorRouter = router2;

// src/middlewares/errorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 400;
  let message = err.message || "Internal Servar Error";
  let error = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Missing field or incorrect field type.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      message = "Record not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      message = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Foreign key constraint failed.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Error occurred during query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      message = "Authentication error.";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      message = "Cannot connect to the database.";
    }
  }
  res.status(statusCode).json({ success: false, message, error });
}
var errorHandler_default = errorHandler;

// src/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    message: "Route not  found"
  });
};

// src/modules/category/category.router.ts
import { Router as Router3 } from "express";

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  return await prisma.category.create({
    data
  });
};
var createSubject = async (data) => {
  return await prisma.subject.create({
    data
  });
};
var getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      subjects: true
    }
  });
};
var updateCategory = async (data, categoryId) => {
  return await prisma.category.update({
    where: {
      id: categoryId
    },
    data
  });
};
var updateSubject = async (data, subjectId) => {
  return await prisma.subject.update({
    where: {
      id: subjectId
    },
    data
  });
};
var deleteCategory = async (categoryId) => {
  return await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
};
var deleteSubject = async (subjectId) => {
  return await prisma.subject.delete({
    where: {
      id: subjectId
    }
  });
};
var categoryService = { getAllCategories, createCategory, createSubject, updateCategory, updateSubject, deleteCategory, deleteSubject };

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    return res.status(201).json({ success: true, message: "Category created successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var createSubject2 = async (req, res, next) => {
  try {
    const result = await categoryService.createSubject(req.body);
    return res.status(201).json({ success: true, message: "Subject created successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories();
    if (result.length < 1) {
      return res.status(200).json({ success: true, message: "No categories found", data: [] });
    }
    return res.status(200).json({ success: true, message: "Categories data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(req.body, req.params.categoryId);
    return res.status(200).json({ success: true, message: "Category updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateSubject2 = async (req, res, next) => {
  try {
    const result = await categoryService.updateSubject(req.body, req.params.subjectId);
    return res.status(200).json({ success: true, message: "Subject updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.categoryId);
    return res.status(200).json({ success: true, message: "Category deleted successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteSubject2 = async (req, res, next) => {
  try {
    const result = await categoryService.deleteSubject(req.params.subjectId);
    return res.status(200).json({ success: true, message: "Subject deleted successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var categoryController = { getAllCategories: getAllCategories2, createCategory: createCategory2, createSubject: createSubject2, updateCategory: updateCategory2, updateSubject: updateSubject2, deleteCategory: deleteCategory2, deleteSubject: deleteSubject2 };

// src/modules/category/category.router.ts
var router3 = Router3();
router3.get("/", categoryController.getAllCategories);
router3.post("/create", auth3(UserRoles.ADMIN), categoryController.createCategory);
router3.post("/subject/create", auth3(UserRoles.ADMIN), categoryController.createSubject);
router3.put("/update/:categoryId", auth3(UserRoles.ADMIN), categoryController.updateCategory);
router3.put("/update/subject/:subjectId", auth3(UserRoles.ADMIN), categoryController.updateSubject);
router3.delete("/delete/:categoryId", auth3(UserRoles.ADMIN), categoryController.deleteCategory);
router3.delete("/delete/subject/:subjectId", auth3(UserRoles.ADMIN), categoryController.deleteSubject);
var categoryRouter = router3;

// src/modules/availability/availability.router.ts
import Router4 from "express";

// src/modules/availability/availability.service.ts
var createAvailability = async (data, tutorId) => {
  const { day, startTime, endTime } = data;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new Error("Time must be in HH:mm format");
  }
  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }
  const conflict = await prisma.availability.findFirst({
    where: {
      tutorId,
      day,
      status: "AVAILABLE",
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } }
      ]
    }
  });
  if (conflict) {
    throw new Error("This time slot overlaps with existing availability");
  }
  return prisma.availability.create({
    data: {
      tutorId,
      day,
      startTime,
      endTime
    }
  });
};
var getAllAvailabilities = async (tutorId) => {
  return await prisma.availability.findMany({
    where: {
      tutorId
    }
  });
};
var updateAvailability = async (data, tutorId, availabilityId) => {
  const existing = await prisma.availability.findUnique({
    where: { id: availabilityId, tutorId }
  });
  if (!existing) {
    throw new Error("Availability not found");
  }
  if (existing.tutorId !== tutorId) {
    throw new Error("Not authorized to update this availability");
  }
  if (existing.status === "BOOKED") {
    throw new Error("Cannot modify a booked availability");
  }
  const day = data.day ?? existing.day;
  const startTime = data.startTime ?? existing.startTime;
  const endTime = data.endTime ?? existing.endTime;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new Error("Time must be in HH:mm format");
  }
  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }
  const conflict = await prisma.availability.findFirst({
    where: {
      tutorId,
      day,
      status: AvailabilityStatus.AVAILABLE,
      NOT: { id: availabilityId },
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } }
      ]
    }
  });
  if (conflict) {
    throw new Error("This time slot overlaps with existing availability");
  }
  return prisma.availability.update({
    where: { id: availabilityId },
    data: {
      day,
      startTime,
      endTime
    }
  });
};
var deleteAvailability = async (availabilityId, tutorId) => {
  const existing = await prisma.availability.findUnique({
    where: { id: availabilityId }
  });
  if (!existing) {
    throw new Error("Availability not found");
  }
  if (existing.tutorId !== tutorId) {
    throw new Error("Not authorized to delete this availability");
  }
  if (existing.status === AvailabilityStatus.BOOKED) {
    throw new Error("Cannot delete a booked availability");
  }
  return prisma.availability.delete({
    where: { id: availabilityId }
  });
};
var availabilityService = { getAllAvailabilities, createAvailability, updateAvailability, deleteAvailability };

// src/modules/availability/availability.controller.ts
var createAvailability2 = async (req, res, next) => {
  try {
    const result = await availabilityService.createAvailability(req.body, req.tutorId);
    return res.json({ success: true, message: "Tutor availability slot created successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllAvailabilities2 = async (req, res, next) => {
  try {
    const result = await availabilityService.getAllAvailabilities(req.tutorId);
    return res.json({ success: true, message: "Tutor availability data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateAvailability2 = async (req, res, next) => {
  try {
    const data = req.body;
    const tutorId = req.tutorId;
    const availabilityId = req.params.availabilityId;
    const result = await availabilityService.updateAvailability(data, tutorId, availabilityId);
    return res.json({ success: true, message: "Tutor availability slot updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteAvailability2 = async (req, res, next) => {
  try {
    const tutorId = req.tutorId;
    const availabilityId = req.params.availabilityId;
    const result = await availabilityService.deleteAvailability(availabilityId, tutorId);
    return res.json({ success: true, message: "Tutor availability slot deleted successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var availabilityController = { getAllAvailabilities: getAllAvailabilities2, createAvailability: createAvailability2, updateAvailability: updateAvailability2, deleteAvailability: deleteAvailability2 };

// src/modules/availability/availability.router.ts
var router4 = Router4();
router4.get("/", auth3(UserRoles.TUTOR), availabilityController.getAllAvailabilities);
router4.post("/create", auth3(UserRoles.TUTOR), availabilityController.createAvailability);
router4.put("/update/:availabilityId", auth3(UserRoles.TUTOR), availabilityController.updateAvailability);
router4.delete("/delete/:availabilityId", auth3(UserRoles.TUTOR), availabilityController.deleteAvailability);
var availabilityRouter = router4;

// src/modules/booking/booking.router.ts
import { Router as Router5 } from "express";

// src/modules/booking/booking.service.ts
var getAllBookings = async (user, tutorId) => {
  if (user.role === UserRoles.STUDENT) {
    return await prisma.booking.findMany({
      where: {
        studentId: user.id
      },
      include: {
        tutor: {
          include: {
            user: true
          }
        },
        availability: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  if (user.role === UserRoles.TUTOR) {
    return await prisma.booking.findMany({
      where: {
        tutorId
      },
      include: {
        student: true,
        availability: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  if (user.role === UserRoles.ADMIN) {
    return prisma.booking.findMany({
      include: {
        student: {
          select: {
            name: true,
            email: true
          }
        },
        availability: true,
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  throw new Error("Unauthorized");
};
var getBookingById = async (user, tutorId, bookingId) => {
  if (user.role === UserRoles.STUDENT) {
    return await prisma.booking.findFirst({
      where: {
        studentId: user.id,
        id: bookingId
      },
      include: {
        student: true,
        tutor: {
          include: {
            user: true
          }
        },
        subject: true,
        availability: true,
        review: true
      }
    });
  }
  if (user.role === UserRoles.TUTOR) {
    return await prisma.booking.findFirst({
      where: {
        tutorId,
        id: bookingId
      },
      include: {
        student: true,
        tutor: {
          include: {
            user: true
          }
        },
        subject: true,
        availability: true,
        review: true
      }
    });
  }
  if (user.role === UserRoles.ADMIN) {
    return await prisma.booking.findFirst({
      where: {
        id: bookingId
      },
      include: {
        student: true,
        tutor: {
          include: {
            user: true
          }
        },
        subject: true,
        availability: true,
        review: true
      }
    });
  }
  throw new Error("Unauthorized");
};
var createBooking = async (data, studentId) => {
  const { tutorId, availabilityId, subjectId } = data;
  if (!availabilityId || !tutorId || !subjectId) {
    throw new Error("Availability ID, Tutor ID, and Subject ID are required");
  }
  const tutorInfo = await prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUniqueOrThrow({
      where: {
        id: availabilityId,
        tutorId
      }
    });
    const tutor = await tx.tutorProfiles.findUniqueOrThrow({
      where: {
        id: tutorId
      }
    });
    return { ...tutor, availability };
  });
  if (tutorInfo.availability.status === AvailabilityStatus.BOOKED) {
    throw new Error("This availability is already booked");
  }
  const { startTime, endTime } = tutorInfo.availability;
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const duration = (end - start) / 60;
  const price = tutorInfo.hourlyRate * duration;
  return prisma.$transaction(async (tx) => {
    await tx.availability.update({
      where: {
        id: availabilityId
      },
      data: {
        status: AvailabilityStatus.BOOKED
      }
    });
    return await tx.booking.create({
      data: {
        studentId,
        tutorId,
        availabilityId,
        price,
        subjectId
      }
    });
  });
};
var updateBookingStatus = async (bookingId, status, user, tutorId) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId }
  });
  if (user.role === UserRoles.STUDENT) {
    if (booking.status === BookingStatus.COMPLETED) {
      throw new Error("You can't change a completed booking");
    }
    if (status !== BookingStatus.CANCELLED) {
      throw new Error("Students can only cancel their bookings");
    }
    if (booking.studentId !== user.id) {
      throw new Error("Not authorized to cancel this booking");
    }
  }
  if (tutorId) {
    if (user.role === UserRoles.TUTOR) {
      if (booking.status === BookingStatus.CANCELLED) {
        throw new Error("You can't change a cancelled booking");
      }
      if (status !== BookingStatus.COMPLETED) {
        throw new Error("Tutors can only complete bookings");
      }
      if (booking.tutorId !== tutorId) {
        throw new Error("Not authorized to complete this booking");
      }
    }
  }
  return await prisma.$transaction(async (tx) => {
    await tx.availability.update({
      where: {
        id: booking.availabilityId
      },
      data: {
        status: AvailabilityStatus.AVAILABLE
      }
    });
    return await tx.booking.update({
      where: { id: bookingId },
      data: {
        status,
        completedAt: status === BookingStatus.COMPLETED ? /* @__PURE__ */ new Date() : null
      }
    });
  });
};
var bookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
};

// src/modules/booking/booking.controller.ts
var getAllBookings2 = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBookings(req.user, req.tutorId);
    return res.json({ success: true, message: "Bookings data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var getBookingById2 = async (req, res, next) => {
  try {
    const result = await bookingService.getBookingById(req.user, req.tutorId, req.params.bookingId);
    return res.json({ success: true, message: "Booking data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var createBooking2 = async (req, res, next) => {
  try {
    const data = req.body;
    const studentId = req.user?.id;
    const result = await bookingService.createBooking(data, studentId);
    return res.json({ success: true, message: "Booking created successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateBookingStatus2 = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.json({ success: false, message: "Invalid input" });
    }
    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status type" });
    }
    const tutorId = req.user?.role === UserRoles.TUTOR ? req.tutorId : null;
    const bookingId = req.params.bookingId;
    const result = await bookingService.updateBookingStatus(bookingId, status, req.user, tutorId);
    return res.json({ success: true, message: "Booking status updated", data: result });
  } catch (e) {
    next(e);
  }
};
var bookingController = { createBooking: createBooking2, updateBookingStatus: updateBookingStatus2, getAllBookings: getAllBookings2, getBookingById: getBookingById2 };

// src/modules/booking/booking.router.ts
var router5 = Router5();
router5.get("/", auth3(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN), bookingController.getAllBookings);
router5.get("/:bookingId", auth3(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN), bookingController.getBookingById);
router5.post("/create", auth3(UserRoles.STUDENT), bookingController.createBooking);
router5.put("/update/:bookingId", auth3(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN), bookingController.updateBookingStatus);
var bookingRouter = router5;

// src/modules/review/review.router.ts
import { Router as Router6 } from "express";

// src/modules/review/review.service.ts
var createReview = async (data, studentId) => {
  const { bookingId, rating, review } = data;
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }
  if (!review || review.trim().length === 0) {
    throw new Error("Review cannot be empty");
  }
  const numericRating = Number(rating);
  if (isNaN(numericRating)) {
    throw new Error("Rating must be a number");
  }
  if (numericRating < 1 || numericRating > 5) {
    throw new Error("Rating must be between 1 and 5.0");
  }
  const roundedRating = Number(numericRating.toFixed(1));
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: { id: bookingId },
      select: {
        id: true,
        studentId: true,
        tutorId: true,
        status: true
      }
    });
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new Error("Booking must be completed to leave a review");
    }
    if (booking.studentId !== studentId) {
      throw new Error("Not authorized to leave a review for this booking");
    }
    const existingReview = await tx.review.findUnique({
      where: { bookingId }
    });
    if (existingReview) {
      throw new Error("Review already exists for this booking");
    }
    const tutorReviews = await tx.review.findMany({
      where: { tutorId: booking.tutorId },
      select: { rating: true }
    });
    const totalOld = tutorReviews.reduce((acc, r) => acc + Number(r.rating), 0);
    const newAverage = Number(((totalOld + roundedRating) / (tutorReviews.length + 1)).toFixed(1));
    await tx.tutorProfiles.update({
      where: { id: booking.tutorId },
      data: {
        totalReviews: tutorReviews.length + 1,
        avgRating: newAverage
      }
    });
    return await tx.review.create({
      data: {
        bookingId: booking.id,
        studentId,
        tutorId: booking.tutorId,
        rating: roundedRating,
        review: review.trim()
      }
    });
  });
};
var updateReview = async (reviewId, data, studentId) => {
  const { rating, review } = data;
  if (!review || review.trim().length === 0) {
    throw new Error("Review cannot be empty");
  }
  const numericRating = Number(rating);
  if (isNaN(numericRating)) {
    throw new Error("Rating must be a number");
  }
  if (numericRating < 1 || numericRating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const roundedRating = Number(numericRating.toFixed(1));
  return await prisma.$transaction(async (tx) => {
    const existingReview = await tx.review.findUniqueOrThrow({
      where: { id: reviewId },
      select: {
        id: true,
        studentId: true,
        tutorId: true,
        rating: true
      }
    });
    if (existingReview.studentId !== studentId) {
      throw new Error("You can only edit your own review");
    }
    const tutor = await tx.tutorProfiles.findUniqueOrThrow({
      where: { id: existingReview.tutorId },
      select: {
        avgRating: true,
        totalReviews: true
      }
    });
    const totalOld = Number(tutor.avgRating) * tutor.totalReviews;
    const newAverage = Number(
      ((totalOld - Number(existingReview.rating) + roundedRating) / tutor.totalReviews).toFixed(1)
    );
    await tx.tutorProfiles.update({
      where: { id: existingReview.tutorId },
      data: {
        avgRating: newAverage
      }
    });
    return await tx.review.update({
      where: { id: reviewId },
      data: {
        rating: roundedRating,
        review: review.trim()
      }
    });
  });
};
var getAllReviews = async (user, tutorId) => {
  if (user.role === UserRoles.STUDENT) {
    return await prisma.review.findMany({
      where: {
        studentId: user.id
      },
      include: {
        student: true,
        tutor: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  if (user.role === UserRoles.TUTOR) {
    return await prisma.review.findMany({
      where: {
        tutorId
      },
      include: {
        student: true,
        tutor: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  if (user.role === UserRoles.ADMIN) {
    return prisma.review.findMany({
      include: {
        student: true,
        tutor: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  throw new Error("Unauthorized");
};
var reviewService = { createReview, updateReview, getAllReviews };

// src/modules/review/review.controller.ts
var getAllReviews2 = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews(req.user, req.tutorId);
    return res.json({ success: true, message: "Reviews data retrieved successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var createReview2 = async (req, res, next) => {
  try {
    const data = req.body;
    const studentId = req.user?.id;
    const result = await reviewService.createReview(data, studentId);
    return res.json({ success: true, message: "Review added successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var updateReview2 = async (req, res, next) => {
  try {
    const data = req.body;
    const studentId = req.user?.id;
    const reviewId = req.params.reviewId;
    const result = await reviewService.updateReview(reviewId, data, studentId);
    return res.json({ success: true, message: "Review updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};
var reviewController = { createReview: createReview2, updateReview: updateReview2, getAllReviews: getAllReviews2 };

// src/modules/review/review.router.ts
var router6 = Router6();
router6.get("/", auth3(UserRoles.STUDENT, UserRoles.TUTOR), reviewController.getAllReviews);
router6.post("/create", auth3(UserRoles.STUDENT), reviewController.createReview);
router6.put("/update/:reviewId", auth3(UserRoles.STUDENT), reviewController.updateReview);
var reviewRouter = router6;

// src/app.ts
console.log(process.env.APP_URL);
var app = express();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:4000",
  process.env.PROD_APP_URL,
  // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/tutors", tutorRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.get("/", (_, res) => {
  res.json("Welcome to Skillbridge server");
});
app.use(errorHandler_default);
app.use(notFound);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT;
async function main() {
  try {
    await prisma.$connect();
    console.log("DB connected successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
