# JustPush Node

JustPush nodes are the communication system that verifies and dispatch push notifications in protocol. 

Ideally in future, JustPush nodes will be p2p based validators that can be run by anyone with staking rewards and stashing. But for the scope of the hacakthon - only the core functionalities are implemented.

This repository consists of multiple packages.

- (packages/api) API to communicate with justpush protocol
- (packages/api-types) Typescript api types
- (pacakges/common) Logic that persist notifications and verifies signatures
