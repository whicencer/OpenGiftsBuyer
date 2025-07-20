# Open Gifts Buyer
This is the Telegram bot that automatically detect and purchase new limited gifts in Telegram.
> Important note: Bot buys only limited gifts until all of them are sold out or balance is insufficient.

## Installation and configuration
First of all you need **Docker** and **Docker Compose** installed on your machine.
How to do this, you can find [here](https://docs.docker.com/compose/install)
### 1.1 Environment variables
Open file `.env.example` and fill all necessary fields.  
**Don't forget to rename `.env.example` file to `.env`!**

## Bot Launch
To launch the bot just open CMD or Terminal on your PC and run `docker-compose up --build -d` (or `docker compose up --build -d` if first command didn't work)  
This command will start your Docker container with database and bot at once.