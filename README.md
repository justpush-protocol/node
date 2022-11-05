<div align="center">
  <img height="170x" src="https://i.imgur.com/Jzhomj5.png" />

  <h1>JustPush</h1>

  <p>
    <strong>Push notifications for the TRON ecosystem</strong>
  </p>

  <p>
    <a href="https://docs.justpush.app/"><img alt="Docs" src="https://img.shields.io/badge/docs-justpush-informational" /></a>
    <a href="https://discord.gg/Baqkey4sPK"><img alt="Discord Chat" src="https://img.shields.io/discord/1037419699409006592?color=yellowgreen" /></a>
    <a href="https://opensource.org/licenses/MIT"><img alt="License" src="https://img.shields.io/github/license/justpush-protocol/node?color=blueviolet" /></a>
  </p>
</div>

JustPush brings notification capabilities to the TRON ecosystem.

The protocol consists of several componenets. 

> All the components were implemented in the hacakthon timeframe.

### Smart contracts
[[github.com/justpush-protocol/contracts](https://github.com/justpush-protocol/contracts)]


### JustPush node
This repository

### JustPush SDK
[[github.com/justpush-protocol/sdk](https://github.com/justpush-protocol/sdk)]

### Dapp
[[github.com/justpush-protocol/frontend](https://github.com/justpush-protocol/frontend)]

### Telegram Bot
[[github.com/justpush-protocol/telegram-bot](https://github.com/justpush-protocol/telegram-bot)]

### Discord Bot
[[github.com/justpush-protocol/discord-bot](https://github.com/justpush-protocol/discord-bot)]

---

## JustPush Node

JustPush is built in a composable way. The end user can recieve notifications from any media. Such as wallets, mobile apps, browser extensions, telegram ([telegram-bot](https://github.com/justpush-protocol/telegram-bot)), discord ([discord-bot](https://github.com/justpush-protocol/telegram-bot)), email, SMS messages, etc.

It is currently impossible to push notifications as such from within the blockchain itself. This gap is filled by JustPush nodes.

This is the communication system that verifies and dispatch push notifications in the protocol. 

Ideally in future, JustPush nodes will be p2p based validators that can be run by anyone with staking rewards and stashing. But for the scope of the hacakthon - only the core functionalities are implemented.

This repository consists of multiple packages.

- [packages/api](./packages/api) API to communicate with justpush protocol
- [packages/api-types](./packages/api-types) Typescript api types
- [packages/listener](./packages/listener) Listner that monitor smart contract events
- [packages/common](./packages/common) Common utils used by both API and listener

---