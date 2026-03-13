from telethon import TelegramClient
import os
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_ID = int(os.getenv("API_ID"))
API_HASH = os.getenv("API_HASH")

# Create Telegram client
client = TelegramClient("session", API_ID, API_HASH)

# Bot username
BOT_USERNAME = "Phonofilmbot"

# Movies to search
movies_to_search = [
    "Avatar 2022",
    "Titanic 1997",
    "Inception 2010"
]


async def main():

    print("Starting bot crawler...\n")

    for movie in movies_to_search:

        print("Searching for:", movie)

        # Send movie name to bot
        await client.send_message(BOT_USERNAME, movie)

        # Wait for bot reply
        await asyncio.sleep(5)

        # Get latest messages from bot
        messages = await client.get_messages(BOT_USERNAME, limit=5)

        for msg in messages:

            # Print bot message
            if msg.text:
                print("\nBot message:")
                print(msg.text)

            # Check if message has buttons
            if msg.buttons:
                print("\nAvailable movie options:")

                for row in msg.buttons:
                    for button in row:
                        print("•", button.text)

            print("\n----------------------")

        print("\n\n")


with client:
    client.loop.run_until_complete(main())