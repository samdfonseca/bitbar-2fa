# BitBar 2FA

A simple two factor authentication app for [BitBar](https://github.com/matryer/bitbar)

![Menu bar screenshot](https://photos-5.dropbox.com/t/2/AABjerjWjkX-mDI3349WZj0soFCnXWczX0SjnexHpMcGjg/12/588073698/png/32x32/3/1484622000/0/2/Screenshot%202017-01-16%2017.49.11.png/EMvfk94EGEYgAigC/cwUVDpWtJ9Z6OYx3lg1Vb99emDyF7Blx3pLmI9j6uEM?size_mode=3&dl=0&size=2048x1536)

## Installation

For now, installing this BitBar plugin requires several manual steps be taken.  

To start, clone this repo to somewhere onto your local machine:

```bash
git clone https://github.com/samdfonseca/bitbar-2fa
cd bitbar-2fa
```

Next, install the dependencies:  

```bash
npm install
```

This plugin assumes that the `bitbar-2fa` directory can be found at `~/.config/bitbar-2fa`. Either clone this repo directly into that location, or symlink it:  

```bash
ln -sf $PWD $HOME/.config/bitbar-2fa
```

It's also assumed that the `node` executable can be found at `/usr/local/bin/node`. If this isn't the case, modify the shebang line in `2fa.1s.js` to the correct location.

Lastly, link the `2fa.1s.js` file into the bitbar plugin directory. For example, if the plugin directory is set to `~/.config/bitbar`:

```bash
ln -sf $PWD/2fa.1s.js $HOME/.config/bitbar/2fa.1s.js
```

## Usage

To add accounts, select `Start Server` from the dropdown in the menubar.

![Accounts page screenshot](https://photos-1.dropbox.com/t/2/AADfvlennf9R-FntGohsQrf6Mvsca4aroQviNpZPRdCqlw/12/588073698/png/32x32/3/1484625600/0/2/Screenshot%202017-01-16%2018.15.54.png/EMvfk94EGEggAigC/cShHLCvIPqvV_GgyPhr7eURz8_TeQPgt5E-GYb5fdQA?size_mode=3&dl=0&size=2048x1536)
