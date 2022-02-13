# CRV->AAVE Autocompounder

## Private Key Disclaimer!!!

Please protect yourselves and do not use the private keys of an account that has a lot to lose and use this repository for learning only. Always add the .env file to .gitignore so it's not committed to the repo


## Pre-requisites
- node.js installed
- A code editor like VS Code installed


# Installation Steps
- Download this repository using `git clone` or hitting the download button
- Open the Mac Terminal, change the directory in the terminal to that of the project using the `cd` command e.g. `cd Downloads/crv_aave_autocompounder`
- Install the web3 js libraries and dotenv by running the following commands
    - `npm install web3`
    - `npm install dotenv`
- Create the .gitignore file and add .env as an entry to the file
    - `vi .gitignore` to open the file and edit the file
- Copy the contents of `sample_env` and create a new file called `.env`
- Paste into `.env` and populate the required info
    - PRIVATE_KEY=<remove these brackets and enter your private key, read the disclaimer above about keys>
    - ON_BEHALF_OF=<remove these brackets andenter the address contains the funds and will be used for autocompounding>

# Steps to Run
- Once the steps above are completed, in the same terminal enter the command to run the code `node autocompound.js`
- Observe the results in the terminal, check your account in Crv and AAVE to see if the info is accurate and continue editing the code so that you can learn more by doing. 


