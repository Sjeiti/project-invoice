# Project Invoice

This invoicing application stores all your data on your local machine.
 
Project Invoice is accessible offline after the application has been loaded for the first time.
Your local documents are not shared between different browsers or computers.
Clearing your browser's data may **delete all your local documents!**. Backup your data regularly!


## Getting Started

You can head to [Project Invoice](http://sjeiti.github.io/project-invoice) and start creating invoices.
Or you can make a local installation.

### Running on localhost

To get the application running you only need NodeJS, npm and GIT. If you don't know what those are you might be better off simply using the online version, your data will be just as safe.

`git clone https://github.com/Sjeiti/project-invoice.git`
`npm i`
`npm run start`


## Why 

Being self-employed all my life means I've been sending invoices for quite a while. I've seen a lot of invoicing software/services but was never really satisfied.
So I created my own:

 - no cloud based data, everything is saved on your local machine, nothing is sent to a server
 - invoices are well designed and customizable
 - its easy to use
 - its open-source
 - its free
 - you can use the online version or run a local copy

I cleaned it up a bit because I thought you might like it.


##faq

###Wait, this app is online in a browser. How is my private data not online?

Every site can access something called LocalStorage which resides on your local machine. This is where your data is stored. Websites can never access the LocalStorage of another website. Never will data be sent from your computer to the server. The only network communication is the application logic being sent from the server to your computer. All your private data remains on your own computer.

###Is this safe?

Storing your data on your local machine is safer than sending and receiving it over the internet. And since LocalStorage is so called origin-specific, only this website can read this websites LocalStorage. But you can also run this on localhost if your tech savvy enough. It is as safe as you treat your computers security.

###Don't I have to login with a username and password?

Logins are useful for server authentication. But since your data is stored on your local machine and not on a server, no authentication is needed.

###How can I access my data from different machines?

Since the data is stored locally you can only access it from one computer. However you can save and/or import the data from the settings page. You could save it on a usb stick to transfer the data to a different computer.

###I want to clear my LocalStorage to wipe all my data.

There is a button for that on the settings page.


##License

This project is licensed under the MIT License - see the LICENSE.md file for details