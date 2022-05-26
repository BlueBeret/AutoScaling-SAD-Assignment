### Cara setup

1. buat instance
2. connect pake ssh
3. install git
   - `sudo yum install git`
4. clone repo
   - `git clone https://github.com/BlueBeret/AutoScaling-SAD-Assignment.git`
   - pilih service mana yg akan dijalanin
   - update host address
5. instal nodejs & npm, then project
   - ```curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -```
   - `sudo yum install -y nodejs`
   - `npm install`

6. install pm2
   - `sudo npm install pm2 -g`

7. start service
   - `pm2 start index.js`
