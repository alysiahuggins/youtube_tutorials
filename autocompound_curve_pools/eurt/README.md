# CRV(Polygon)->EURT Monitor Rewards

## Disclaimers


### Private Key(s)

- Please protect yourselves and do not use the private keys of an account that has a lot to lose and use this repository for learning only. Always add the .env file to .gitignore so it's not committed to the repo

### Wallet address(es)

- Please protect your privacy and do not upload the wallets.js file to your code repository.  

## Installation


### Pre-requisites

- node.js installed
- A code editor like VS Code installed

### Install Steps

- Download this repository using `git clone git@github.com:gacook/youtube_tutorials.git` or hitting the download button
- Open the Mac Terminal, change the directory in the terminal to that of the project using the `cd` command e.g. `cd Downloads/youtube_tutorials/autocompound_curve_pools/eurt`
- Install the required dependencies
  - `npm install`
- Create the .gitignore file (if needed) and add wallet.js as an entry to the file
  - `vi .gitignore` to open the file and edit the file
- Copy the contents of `sample_wallets` and create a new file called `wallets.js`
- Paste into `wallets` and populate the required info
    const wallets = {
        "polygon": {
            "primary": "0xb05424eb5f8ee658e8e9de3ce9af9d6463517fa9"
        }
    };
    module.exports = {
        wallets
    };


## Steps to Run

- Once the steps above are completed, in the same terminal enter the command to run the code `node monitor_rewards.js`
- Observe the results in the terminal, check your account in Crv and EURT to see if the info is accurate and continue editing the code so that you can learn more by doing.
