-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "passward" TEXT,
    "phone_number" TEXT NOT NULL,
    "recovery_email" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "sex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "messages" (
    "messageId" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "Cc" TEXT[],
    "Bcc" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "messages_mapping" (
    "mappingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "isStarred" BOOLEAN NOT NULL,

    CONSTRAINT "messages_mapping_pkey" PRIMARY KEY ("mappingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages_mapping" ADD CONSTRAINT "messages_mapping_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("messageId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages_mapping" ADD CONSTRAINT "messages_mapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
