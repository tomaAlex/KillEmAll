# KillEmAll
This repository contains a project, which has a little game called "KillEmAll". This game is written in JavaScript, with p5.js library. This is a 2D game and its purpose, as its name states, is to kill all the other players in a match, the last remaining player to be alive being the winner of that particular match. Every player is able to shoot bullets into its enemies, in order to kill them, but the enemies can defend themselves, by drawing walls on the map. which are "solid" objects, so that a wall might represent a shield. However, walls are being made from a finite number of circles, so a player cannot abuse the use of the walls. Also, after a finite amount of time, a wall would be deleted from the map, so the map does not become an unplayable place (for sample: some player could, eventually, draw a full wall around itself, so none of the players left on the map could attack itself.
